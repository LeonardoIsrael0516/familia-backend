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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
let NotificationService = class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPreferences(userId) {
        const prefs = await this.prisma.notificationPreference.findMany({
            where: { userId },
        });
        return {
            devocionalReminder: prefs.find((p) => p.type === client_1.NotificationType.devocional_reminder)
                ? {
                    enabled: prefs.find((p) => p.type === client_1.NotificationType.devocional_reminder).enabled,
                    productId: prefs.find((p) => p.type === client_1.NotificationType.devocional_reminder).productId,
                }
                : { enabled: false, productId: null },
        };
    }
    async updatePreferences(userId, data) {
        if (data.devocionalReminder != null) {
            await this.prisma.notificationPreference.upsert({
                where: {
                    userId_type: {
                        userId,
                        type: client_1.NotificationType.devocional_reminder,
                    },
                },
                create: {
                    userId,
                    type: client_1.NotificationType.devocional_reminder,
                    enabled: data.devocionalReminder.enabled,
                    productId: data.devocionalReminder.productId ?? null,
                },
                update: {
                    enabled: data.devocionalReminder.enabled,
                    productId: data.devocionalReminder.productId ?? null,
                },
            });
        }
        return this.getPreferences(userId);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map