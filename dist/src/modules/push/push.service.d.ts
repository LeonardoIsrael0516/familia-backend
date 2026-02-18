import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';
export declare class PushService {
    private readonly prisma;
    private readonly config;
    private initialized;
    constructor(prisma: PrismaService, config: ConfigService);
    private get pushSubscription();
    saveSubscription(userId: string, dto: CreatePushSubscriptionDto, userAgent?: string): Promise<void>;
    private sendToSubscription;
    sendToUser(userId: string, payload: {
        title: string;
        body?: string;
        url?: string;
    }): Promise<number>;
    sendToAll(payload: {
        title: string;
        body?: string;
        url?: string;
    }): Promise<{
        sent: number;
        total: number;
    }>;
}
