import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ProductType, StreakType } from '@prisma/client';
import { SaveDevocionalProgressDto } from './dto/save-progress.dto';
import { SavePlannerProgressDto } from './dto/save-planner-progress.dto';

@Injectable()
export class UserProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureKitProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (product.type !== ProductType.kit) {
      throw new BadRequestException('Produto não é do tipo kit');
    }
    return product;
  }

  private async ensureDevocionalProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (product.type !== ProductType.devocional) {
      throw new BadRequestException('Produto não é do tipo devocional');
    }
    return product;
  }

  async getDevocionalProgress(userId: string, productId: string) {
    await this.ensureDevocionalProduct(productId);
    const [progressList, streak, userBadges] = await Promise.all([
      this.prisma.userDevocionalProgress.findMany({
        where: { userId, productId },
        orderBy: { dayNumber: 'asc' },
      }),
      this.prisma.userStreak.findFirst({
        where: {
          userId,
          productId,
          streakType: StreakType.devocional,
        },
      }),
      this.prisma.userBadge.findMany({
        where: {
          userId,
          badge: { productId },
        },
        include: { badge: true },
      }),
    ]);
    const completedDayNumbers = progressList.map((p) => p.dayNumber);
    const progressByDay = progressList.map((p) => ({
      dayNumber: p.dayNumber,
      completedAt: p.completedAt,
      notes: p.notes,
    }));
    return {
      completedDayNumbers,
      completedCount: completedDayNumbers.length,
      progressByDay,
      streak: streak
        ? {
            currentStreak: streak.currentStreak,
            lastActivityDate: streak.lastActivityDate,
          }
        : { currentStreak: 0, lastActivityDate: null },
      badges: userBadges.map((ub) => ({
        id: ub.badge.id,
        code: ub.badge.code,
        name: ub.badge.name,
        description: ub.badge.description,
        iconUrl: ub.badge.iconUrl,
        earnedAt: ub.earnedAt,
      })),
    };
  }

  async saveDevocionalProgress(
    userId: string,
    productId: string,
    dto: SaveDevocionalProgressDto,
  ) {
    await this.ensureDevocionalProduct(productId);
    const day = await this.prisma.devocionalDay.findUnique({
      where: {
        productId_dayNumber: { productId, dayNumber: dto.dayNumber },
      },
    });
    if (!day) throw new NotFoundException('Dia não encontrado neste devocional');

    await this.prisma.userDevocionalProgress.upsert({
      where: {
        userId_productId_dayNumber: {
          userId,
          productId,
          dayNumber: dto.dayNumber,
        },
      },
      create: {
        userId,
        productId,
        dayNumber: dto.dayNumber,
        notes: dto.notes ?? null,
      },
      update: {
        notes: dto.notes ?? null,
        completedAt: new Date(),
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDate = today;

    let streak = await this.prisma.userStreak.findFirst({
      where: {
        userId,
        productId,
        streakType: StreakType.devocional,
      },
    });

    if (!streak) {
      streak = await this.prisma.userStreak.create({
        data: {
          userId,
          productId,
          streakType: StreakType.devocional,
          currentStreak: 1,
          lastActivityDate: todayDate,
        },
      });
    } else {
      const last = new Date(streak.lastActivityDate);
      last.setHours(0, 0, 0, 0);
      const diffDays = Math.floor(
        (todayDate.getTime() - last.getTime()) / (24 * 60 * 60 * 1000),
      );
      let newStreak = streak.currentStreak;
      if (diffDays === 0) {
        // same day, no change to streak count
      } else if (diffDays === 1) {
        newStreak = streak.currentStreak + 1;
      } else {
        newStreak = 1;
      }
      streak = await this.prisma.userStreak.update({
        where: { id: streak.id },
        data: {
          currentStreak: newStreak,
          lastActivityDate: todayDate,
        },
      });
    }

    const completedCount = await this.prisma.userDevocionalProgress.count({
      where: { userId, productId },
    });
    const totalDays = await this.prisma.devocionalDay.count({
      where: { productId },
    });

    await this.checkAndAwardBadges(userId, productId, completedCount, streak.currentStreak);

    return this.getDevocionalProgress(userId, productId);
  }

  async getPlannerProgress(userId: string, productId: string): Promise<{ checks: Record<string, boolean> }> {
    await this.ensureKitProduct(productId);
    const row = await this.prisma.userKitProgress.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    const checks = (row?.plannerChecks as Record<string, boolean>) ?? {};
    return { checks };
  }

  async savePlannerProgress(
    userId: string,
    productId: string,
    dto: SavePlannerProgressDto,
  ): Promise<{ checks: Record<string, boolean> }> {
    await this.ensureKitProduct(productId);
    const checks = dto.checks ?? {};
    await this.prisma.userKitProgress.upsert({
      where: {
        userId_productId: { userId, productId },
      },
      create: {
        userId,
        productId,
        plannerChecks: checks,
      },
      update: {
        plannerChecks: checks,
      },
    });
    return { checks };
  }

  private async checkAndAwardBadges(
    userId: string,
    productId: string,
    completedCount: number,
    currentStreak: number,
  ) {
    const badges = await this.prisma.badge.findMany({
      where: { productId },
    });
    for (const badge of badges) {
      const cond = badge.conditionValue as Record<string, number>;
      const type = badge.conditionType;
      let earned = false;
      if (type === 'days_completed' && cond?.days != null && completedCount >= cond.days) {
        earned = true;
      }
      if (type === 'streak_7' && currentStreak >= 7) {
        earned = true;
      }
      if (type === 'streak' && cond?.days != null && currentStreak >= cond.days) {
        earned = true;
      }
      if (!earned) continue;
      const existing = await this.prisma.userBadge.findUnique({
        where: {
          userId_badgeId: { userId, badgeId: badge.id },
        },
      });
      if (!existing) {
        await this.prisma.userBadge.create({
          data: { userId, badgeId: badge.id },
        });
      }
    }
  }
}
