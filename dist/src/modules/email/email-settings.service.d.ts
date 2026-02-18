import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';
export interface EmailSettingsConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string | null;
    password: string | null;
    fromEmail: string;
    fromName: string;
}
export interface EmailSettingsResponse {
    host: string;
    port: number;
    secure: boolean;
    user: string | null;
    password: string | null;
    fromEmail: string;
    fromName: string;
}
export declare class EmailSettingsService {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaService, config: ConfigService);
    private get fallback();
    getConfig(): Promise<EmailSettingsConfig>;
    getConfigForAdmin(): Promise<EmailSettingsResponse>;
    updateSettings(dto: UpdateEmailSettingsDto): Promise<EmailSettingsResponse>;
    isConfigured(): boolean;
}
