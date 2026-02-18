import { EmailSettingsService } from './email-settings.service';
import { EmailService } from './email.service';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
export declare class AdminEmailSettingsController {
    private readonly emailSettingsService;
    private readonly emailService;
    constructor(emailSettingsService: EmailSettingsService, emailService: EmailService);
    getSettings(): Promise<import("./email-settings.service").EmailSettingsResponse>;
    updateSettings(dto: UpdateEmailSettingsDto): Promise<import("./email-settings.service").EmailSettingsResponse>;
    sendTest(body: {
        to?: string;
    }): Promise<{
        ok: boolean;
        message: string;
    }>;
}
