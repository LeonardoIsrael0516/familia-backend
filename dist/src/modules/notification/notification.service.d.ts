import { PrismaService } from '../../common/database/prisma.service';
export declare class NotificationService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getPreferences(userId: string): Promise<{
        devocionalReminder: {
            enabled: boolean;
            productId: string | null;
        };
    }>;
    updatePreferences(userId: string, data: {
        devocionalReminder?: {
            enabled: boolean;
            productId?: string | null;
        };
    }): Promise<{
        devocionalReminder: {
            enabled: boolean;
            productId: string | null;
        };
    }>;
}
