import { Injectable } from '@nestjs/common';
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

@Injectable()
export class PwaService {
  private readonly fallback: PwaConfig;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.fallback = {
      appName: this.config.get<string>('pwa.appName') || 'Familia em Conserva',
      shortName: this.config.get<string>('pwa.shortName') || 'Familia em Conserva',
      description: this.config.get<string>('pwa.description') || null,
      themeColor: this.config.get<string>('pwa.themeColor') || '#3d4a2a',
      backgroundColor: this.config.get<string>('pwa.backgroundColor') || '#faf8f5',
      faviconUrl: this.config.get<string>('pwa.faviconUrl') || null,
      icon192Url: this.config.get<string>('pwa.icon192Url') || null,
      icon512Url: this.config.get<string>('pwa.icon512Url') || null,
      appleTouchIconUrl: this.config.get<string>('pwa.appleTouchIconUrl') || null,
      vapidPublicKey: this.config.get<string>('vapid.publicKey') || null,
    };
  }

  private get pwaSettings() {
    type Row = {
      id: string;
      appName: string;
      shortName: string;
      description: string | null;
      themeColor: string;
      backgroundColor: string;
      faviconUrl: string | null;
      icon192Url: string | null;
      icon512Url: string | null;
      appleTouchIconUrl: string | null;
      updatedAt: Date;
    };
    type Delegate = {
      findFirst: () => Promise<Row | null>;
      update: (args: { where: { id: string }; data: object }) => Promise<unknown>;
      create: (args: { data: object }) => Promise<unknown>;
    };
    return (this.prisma as unknown as { pwaSettings: Delegate }).pwaSettings;
  }

  async getConfig(): Promise<PwaConfig> {
    const row = await this.pwaSettings.findFirst();
    if (!row) return this.fallback;
    return {
      appName: row.appName,
      shortName: row.shortName,
      description: row.description,
      themeColor: row.themeColor,
      backgroundColor: row.backgroundColor,
      faviconUrl: row.faviconUrl,
      icon192Url: row.icon192Url,
      icon512Url: row.icon512Url,
      appleTouchIconUrl: row.appleTouchIconUrl,
      vapidPublicKey: this.config.get<string>('vapid.publicKey') || null,
    };
  }

  async getManifest(startUrlOrigin: string): Promise<Record<string, unknown>> {
    const config = await this.getConfig();
    const icons: { src: string; sizes: string; type: string; purpose?: string }[] = [];
    if (config.icon192Url) {
      icons.push({ src: config.icon192Url, sizes: '192x192', type: 'image/png', purpose: 'any' });
    }
    if (config.icon512Url) {
      icons.push({ src: config.icon512Url, sizes: '512x512', type: 'image/png', purpose: 'any' });
    }
    if (config.appleTouchIconUrl) {
      icons.push({
        src: config.appleTouchIconUrl,
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      });
    }
    if (icons.length === 0 && config.faviconUrl) {
      icons.push({ src: config.faviconUrl, sizes: '192x192', type: 'image/png', purpose: 'any' });
    }
    return {
      name: config.appName,
      short_name: config.shortName,
      description: config.description || undefined,
      theme_color: config.themeColor,
      background_color: config.backgroundColor,
      start_url: startUrlOrigin ? `${startUrlOrigin.replace(/\/$/, '')}/` : '/',
      display: 'standalone',
      icons,
    };
  }

  async getAdminSettings(): Promise<PwaConfig> {
    return this.getConfig();
  }

  async updateSettings(dto: UpdatePwaSettingsDto): Promise<PwaConfig> {
    const existing = await this.pwaSettings.findFirst();
    const data = {
      ...(dto.appName != null && { appName: dto.appName }),
      ...(dto.shortName != null && { shortName: dto.shortName }),
      ...(dto.description !== undefined && { description: dto.description || null }),
      ...(dto.themeColor != null && { themeColor: dto.themeColor }),
      ...(dto.backgroundColor != null && { backgroundColor: dto.backgroundColor }),
      ...(dto.faviconUrl !== undefined && { faviconUrl: dto.faviconUrl || null }),
      ...(dto.icon192Url !== undefined && { icon192Url: dto.icon192Url || null }),
      ...(dto.icon512Url !== undefined && { icon512Url: dto.icon512Url || null }),
      ...(dto.appleTouchIconUrl !== undefined && {
        appleTouchIconUrl: dto.appleTouchIconUrl || null,
      }),
    };
    if (existing) {
      await this.pwaSettings.update({
        where: { id: existing.id },
        data,
      });
    } else {
      await this.pwaSettings.create({
        data: {
          appName: data.appName ?? this.fallback.appName,
          shortName: data.shortName ?? this.fallback.shortName,
          description: data.description ?? this.fallback.description,
          themeColor: data.themeColor ?? this.fallback.themeColor,
          backgroundColor: data.backgroundColor ?? this.fallback.backgroundColor,
          faviconUrl: data.faviconUrl ?? this.fallback.faviconUrl,
          icon192Url: data.icon192Url ?? this.fallback.icon192Url,
          icon512Url: data.icon512Url ?? this.fallback.icon512Url,
          appleTouchIconUrl: data.appleTouchIconUrl ?? this.fallback.appleTouchIconUrl,
        },
      });
    }
    return this.getConfig();
  }
}
