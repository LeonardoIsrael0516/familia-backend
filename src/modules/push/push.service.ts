import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import * as webPush from 'web-push';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';

@Injectable()
export class PushService {
  private initialized = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const publicKey = this.config.get<string>('vapid.publicKey');
    const privateKey = this.config.get<string>('vapid.privateKey');
    if (publicKey && privateKey) {
      webPush.setVapidDetails(
        'mailto:support@familiaemconserva.com',
        publicKey,
        privateKey,
      );
      this.initialized = true;
    }
  }

  private get pushSubscription() {
    type Delegate = {
      upsert: (args: {
        where: { userId_endpoint: { userId: string; endpoint: string } };
        create: { userId: string; endpoint: string; p256dh: string; auth: string; userAgent: string | null };
        update: { p256dh: string; auth: string; userAgent: string | null };
      }) => Promise<unknown>;
      findMany: (args?: { where?: { userId: string } }) => Promise<Array<{ endpoint: string; p256dh: string; auth: string }>>;
    };
    return (this.prisma as unknown as { pushSubscription: Delegate }).pushSubscription;
  }

  async saveSubscription(userId: string, dto: CreatePushSubscriptionDto, userAgent?: string): Promise<void> {
    await this.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId,
          endpoint: dto.endpoint,
        },
      },
      create: {
        userId,
        endpoint: dto.endpoint,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
        userAgent: userAgent || null,
      },
      update: {
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
        userAgent: userAgent || null,
      },
    });
  }

  private async sendToSubscription(
    subscription: { endpoint: string; p256dh: string; auth: string },
    payload: string,
  ): Promise<boolean> {
    if (!this.initialized) return false;
    try {
      await webPush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        payload,
        { TTL: 86400 },
      );
      return true;
    } catch {
      return false;
    }
  }

  async sendToUser(
    userId: string,
    payload: { title: string; body?: string; url?: string },
  ): Promise<number> {
    const subscriptions = await this.pushSubscription.findMany({
      where: { userId },
    });
    const payloadStr = JSON.stringify(payload);
    let sent = 0;
    for (const sub of subscriptions) {
      const ok = await this.sendToSubscription(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payloadStr,
      );
      if (ok) sent++;
    }
    return sent;
  }

  async sendToAll(payload: { title: string; body?: string; url?: string }): Promise<{ sent: number; total: number }> {
    if (!this.initialized) {
      throw new ServiceUnavailableException(
        'Push não configurado. Defina VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY na .env.',
      );
    }
    const subscriptions = await this.pushSubscription.findMany();
    const payloadStr = JSON.stringify(payload);
    let sent = 0;
    for (const sub of subscriptions) {
      const ok = await this.sendToSubscription(
        { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
        payloadStr,
      );
      if (ok) sent++;
    }
    return { sent, total: subscriptions.length };
  }
}
