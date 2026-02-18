import { NotificationService } from './notification.service';
import { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getPreferences(userId: string): Promise<{
        devocionalReminder: {
            enabled: boolean;
            productId: string | null;
        };
    }>;
    updatePreferences(userId: string, dto: UpdateNotificationPreferencesDto): Promise<{
        devocionalReminder: {
            enabled: boolean;
            productId: string | null;
        };
    }>;
}
