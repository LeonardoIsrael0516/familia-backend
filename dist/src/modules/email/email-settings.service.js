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
exports.EmailSettingsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/database/prisma.service");
let EmailSettingsService = class EmailSettingsService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    get fallback() {
        return {
            host: this.config.get('smtp.host') || '',
            port: this.config.get('smtp.port') ?? 587,
            secure: this.config.get('smtp.secure') ?? false,
            user: this.config.get('smtp.user') || null,
            password: this.config.get('smtp.password') || null,
            fromEmail: this.config.get('smtp.fromEmail') || 'noreply@example.com',
            fromName: this.config.get('smtp.fromName') || 'Familia em Conserva',
        };
    }
    async getConfig() {
        const row = await this.prisma.emailSettings.findFirst();
        if (!row)
            return this.fallback;
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
    async getConfigForAdmin() {
        const config = await this.getConfig();
        return {
            ...config,
            password: config.password ? '********' : null,
        };
    }
    async updateSettings(dto) {
        const existing = await this.prisma.emailSettings.findFirst();
        const data = {};
        if (dto.host != null)
            data.host = dto.host;
        if (dto.port != null)
            data.port = dto.port;
        if (dto.secure != null)
            data.secure = dto.secure;
        if (dto.user !== undefined)
            data.user = dto.user || null;
        if (dto.password !== undefined && dto.password !== '' && dto.password !== '********')
            data.password = dto.password;
        if (dto.fromEmail != null)
            data.fromEmail = dto.fromEmail;
        if (dto.fromName != null)
            data.fromName = dto.fromName;
        const fallback = this.fallback;
        if (existing) {
            await this.prisma.emailSettings.update({
                where: { id: existing.id },
                data: data,
            });
        }
        else {
            await this.prisma.emailSettings.create({
                data: {
                    host: data.host ?? fallback.host,
                    port: data.port ?? fallback.port,
                    secure: data.secure ?? fallback.secure,
                    user: data.user ?? fallback.user,
                    password: data.password ?? fallback.password,
                    fromEmail: data.fromEmail ?? fallback.fromEmail,
                    fromName: data.fromName ?? fallback.fromName,
                },
            });
        }
        return this.getConfigForAdmin();
    }
    isConfigured() {
        return true;
    }
};
exports.EmailSettingsService = EmailSettingsService;
exports.EmailSettingsService = EmailSettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], EmailSettingsService);
//# sourceMappingURL=email-settings.service.js.map