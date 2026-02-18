import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { UpdatePwaSettingsDto } from './dto/update-pwa-settings.dto';
export interface PwaConfig {
    appName: string;
    shortName: string;
    description: string | null;
    themeColor: string;
    backgroundColor: string;
    faviconUrl: string | null;
    icon192Url: string | null;
    icon512Url: string | null;
    appleTouchIconUrl: string | null;
    vapidPublicKey: string | null;
}
export declare class PwaService {
    private readonly prisma;
    private readonly config;
    private readonly fallback;
    constructor(prisma: PrismaService, config: ConfigService);
    private get pwaSettings();
    getConfig(): Promise<PwaConfig>;
    getManifest(startUrlOrigin: string): Promise<Record<string, unknown>>;
    getAdminSettings(): Promise<PwaConfig>;
    updateSettings(dto: UpdatePwaSettingsDto): Promise<PwaConfig>;
}
