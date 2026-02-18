"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PwaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/database/prisma.service");
let PwaService = class PwaService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.fallback = {
            appName: this.config.get('pwa.appName') || 'Familia em Conserva',
            shortName: this.config.get('pwa.shortName') || 'Familia em Conserva',
            description: this.config.get('pwa.description') || null,
            themeColor: this.config.get('pwa.themeColor') || '#3d4a2a',
            backgroundColor: this.config.get('pwa.backgroundColor') || '#faf8f5',
            faviconUrl: this.config.get('pwa.faviconUrl') || null,
            icon192Url: this.config.get('pwa.icon192Url') || null,
            icon512Url: this.config.get('pwa.icon512Url') || null,
            appleTouchIconUrl: this.config.get('pwa.appleTouchIconUrl') || null,
            vapidPublicKey: this.config.get('vapid.publicKey') || null,
        };
    }
    get pwaSettings() {
        return this.prisma.pwaSettings;
    }
    async getConfig() {
        const row = await this.pwaSettings.findFirst();
        if (!row)
            return this.fallback;
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
            vapidPublicKey: this.config.get('vapid.publicKey') || null,
        };
    }
    async getManifest(startUrlOrigin) {
        const config = await this.getConfig();
        const icons = [];
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
    async getAdminSettings() {
        return this.getConfig();
    }
    async updateSettings(dto) {
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
        }
        else {
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
};
exports.PwaService = PwaService;
exports.PwaService = PwaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PwaService);
//# sourceMappingURL=pwa.service.js.map