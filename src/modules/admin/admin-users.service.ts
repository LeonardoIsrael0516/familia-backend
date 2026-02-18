import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { UsersService } from '../users/users.service';
import { PeriodType } from '@prisma/client';

const PERIOD_DAYS: Record<PeriodType, number> = {
  monthly: 30,
  semiannual: 180,
  annual: 365,
};

@Injectable()
export class AdminUsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(params: { search?: string; subscribersOnly?: boolean; limit?: number; offset?: number }) {
    const { search, subscribersOnly, limit = 50, offset = 0 } = params;
    const where: Record<string, unknown> = {};
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      where.OR = [
        { email: { contains: term, mode: 'insensitive' } },
        { name: { contains: term, mode: 'insensitive' } },
      ];
    }
    if (subscribersOnly) {
      where.subscriptions = {
        some: {
          status: 'active',
          expiresAt: { gt: new Date() },
        },
      };
    }
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        take: Math.min(limit, 100),
        skip: offset,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          subscriptions: {
            where: { status: 'active', expiresAt: { gt: new Date() } },
            include: { plan: { select: { id: true, name: true } } },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { items: users, total };
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        subscriptions: {
          orderBy: { createdAt: 'desc' },
          include: {
            plan: { select: { id: true, name: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async createUser(data: { email: string; name: string; password: string; role?: 'user' | 'admin' }) {
    return this.usersService.create({
      email: data.email,
      name: data.name,
      password: data.password,
      role: data.role ?? 'user',
    });
  }

  async changePassword(userId: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await this.usersService.updatePassword(userId, newPassword);
  }

  async addSubscription(
    userId: string,
    planId: string,
    periodType: PeriodType,
    customExpiresAt?: Date,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    const startsAt = new Date();
    const expiresAt =
      customExpiresAt ??
      (() => {
        const d = new Date(startsAt);
        d.setDate(d.getDate() + PERIOD_DAYS[periodType]);
        return d;
      })();
    return this.prisma.subscription.create({
      data: {
        userId,
        planId,
        periodType,
        status: 'active',
        startsAt,
        expiresAt,
      },
      include: {
        plan: { select: { id: true, name: true } },
      },
    });
  }
}
