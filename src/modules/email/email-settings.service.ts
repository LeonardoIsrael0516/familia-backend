import { Injectable } from '@nestjs/common';
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
  password: string | null; // masked in GET: "********" if set
  fromEmail: string;
  fromName: string;
}

@Injectable()
export class EmailSettingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private get fallback(): EmailSettingsConfig {
    return {
      host: this.config.get<string>('smtp.host') || '',
      port: this.config.get<number>('smtp.port') ?? 587,
      secure: this.config.get<boolean>('smtp.secure') ?? false,
      user: this.config.get<string>('smtp.user') || null,
      password: this.config.get<string>('smtp.password') || null,
      fromEmail: this.config.get<string>('smtp.fromEmail') || 'noreply@example.com',
      fromName: this.config.get<string>('smtp.fromName') || 'Familia em Conserva',
    };
  }

  async getConfig(): Promise<EmailSettingsConfig> {
    const row = await this.prisma.emailSettings.findFirst();
    if (!row) return this.fallback;
    return {
      host: row.host,
      port: row.port,
      secure: row.secure,
      user: row.user,
      password: row.password,
      fromEmail: row.fromEmail,
      fromName: row.fromName,
    };
  }

  async getConfigForAdmin(): Promise<EmailSettingsResponse> {
    const config = await this.getConfig();
    return {
      ...config,
      password: config.password ? '********' : null,
    };
  }

  async updateSettings(dto: UpdateEmailSettingsDto): Promise<EmailSettingsResponse> {
    const existing = await this.prisma.emailSettings.findFirst();
    const data: Record<string, unknown> = {};
    if (dto.host != null) data.host = dto.host;
    if (dto.port != null) data.port = dto.port;
    if (dto.secure != null) data.secure = dto.secure;
    if (dto.user !== undefined) data.user = dto.user || null;
    if (dto.password !== undefined && dto.password !== '' && dto.password !== '********')
      data.password = dto.password;
    if (dto.fromEmail != null) data.fromEmail = dto.fromEmail;
    if (dto.fromName != null) data.fromName = dto.fromName;

    const fallback = this.fallback;
    if (existing) {
      await this.prisma.emailSettings.update({
        where: { id: existing.id },
        data: data as object,
      });
    } else {
      await this.prisma.emailSettings.create({
        data: {
          host: (data.host as string) ?? fallback.host,
          port: (data.port as number) ?? fallback.port,
          secure: (data.secure as boolean) ?? fallback.secure,
          user: (data.user as string) ?? fallback.user,
          password: (data.password as string) ?? fallback.password,
          fromEmail: (data.fromEmail as string) ?? fallback.fromEmail,
          fromName: (data.fromName as string) ?? fallback.fromName,
        },
      });
    }
    return this.getConfigForAdmin();
  }

  isConfigured(): boolean {
    return true; // checked at send time in EmailService
  }
}
