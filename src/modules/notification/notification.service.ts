import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async getPreferences(userId: string) {
    const prefs = await this.prisma.notificationPreference.findMany({
      where: { userId },
    });
    return {
      devocionalReminder: prefs.find((p) => p.type === NotificationType.devocional_reminder)
        ? {
            enabled: prefs.find((p) => p.type === NotificationType.devocional_reminder)!.enabled,
            productId: prefs.find((p) => p.type === NotificationType.devocional_reminder)!.productId,
          }
        : { enabled: false, productId: null as string | null },
    };
  }

  async updatePreferences(
    userId: string,
    data: { devocionalReminder?: { enabled: boolean; productId?: string | null } },
  ) {
    if (data.devocionalReminder != null) {
      await this.prisma.notificationPreference.upsert({
        where: {
          userId_type: {
            userId,
            type: NotificationType.devocional_reminder,
          },
        },
        create: {
          userId,
          type: NotificationType.devocional_reminder,
          enabled: data.devocionalReminder.enabled,
          productId: data.devocionalReminder.productId ?? null,
        },
        update: {
          enabled: data.devocionalReminder.enabled,
          productId: data.devocionalReminder.productId ?? null,
        },
      });
    }
    return this.getPreferences(userId);
  }
}
