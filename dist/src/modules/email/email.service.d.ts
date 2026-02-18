import { EmailSettingsService } from './email-settings.service';
export declare class EmailService {
    private readonly emailSettings;
    private transporter;
    private lastConfigHash;
    constructor(emailSettings: EmailSettingsService);
    private getTransporter;
    sendMail(options: {
        to: string;
        subject: string;
        html?: string;
        text?: string;
    }): Promise<boolean>;
    private static htmlWrapper;
    sendWelcomeWithAccess(email: string, name: string, password: string, frontendUrl: string): Promise<boolean>;
    sendSubscriptionActivated(email: string, name: string, frontendUrl: string): Promise<boolean>;
    sendPasswordReset(email: string, resetLink: string): Promise<boolean>;
}
