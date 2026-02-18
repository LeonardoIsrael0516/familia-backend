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
exports.UserProgressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
let UserProgressService = class UserProgressService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureKitProduct(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        if (product.type !== client_1.ProductType.kit) {
            throw new common_1.BadRequestException('Produto não é do tipo kit');
        }
        return product;
    }
    async ensureDevocionalProduct(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        if (product.type !== client_1.ProductType.devocional) {
            throw new common_1.BadRequestException('Produto não é do tipo devocional');
        }
        return product;
    }
    async getDevocionalProgress(userId, productId) {
        await this.ensureDevocionalProduct(productId);
        const [progressList, streak, userBadges] = await Promise.all([
            this.prisma.userDevocionalProgress.findMany({
                where: { userId, productId },
                orderBy: { dayNumber: 'asc' },
            }),
            this.prisma.userStreak.findFirst({
                where: {
                    userId,
                    productId,
                    streakType: client_1.StreakType.devocional,
                },
            }),
            this.prisma.userBadge.findMany({
                where: {
                    userId,
                    badge: { productId },
                },
                include: { badge: true },
            }),
        ]);
        const completedDayNumbers = progressList.map((p) => p.dayNumber);
        const progressByDay = progressList.map((p) => ({
            dayNumber: p.dayNumber,
            completedAt: p.completedAt,
            notes: p.notes,
        }));
        return {
            completedDayNumbers,
            completedCount: completedDayNumbers.length,
            progressByDay,
            streak: streak
                ? {
                    currentStreak: streak.currentStreak,
                    lastActivityDate: streak.lastActivityDate,
                }
                : { currentStreak: 0, lastActivityDate: null },
            badges: userBadges.map((ub) => ({
                id: ub.badge.id,
                code: ub.badge.code,
                name: ub.badge.name,
                description: ub.badge.description,
                iconUrl: ub.badge.iconUrl,
                earnedAt: ub.earnedAt,
            })),
        };
    }
    async saveDevocionalProgress(userId, productId, dto) {
        await this.ensureDevocionalProduct(productId);
        const day = await this.prisma.devocionalDay.findUnique({
            where: {
                productId_dayNumber: { productId, dayNumber: dto.dayNumber },
            },
        });
        if (!day)
            throw new common_1.NotFoundException('Dia não encontrado neste devocional');
        await this.prisma.userDevocionalProgress.upsert({
            where: {
                userId_productId_dayNumber: {
                    userId,
                    productId,
                    dayNumber: dto.dayNumber,
                },
            },
            create: {
                userId,
                productId,
                dayNumber: dto.dayNumber,
                notes: dto.notes ?? null,
            },
            update: {
                notes: dto.notes ?? null,
                completedAt: new Date(),
            },
        });
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDate = today;
        let streak = await this.prisma.userStreak.findFirst({
            where: {
                userId,
                productId,
                streakType: client_1.StreakType.devocional,
            },
        });
        if (!streak) {
            streak = await this.prisma.userStreak.create({
                data: {
                    userId,
                    productId,
                    streakType: client_1.StreakType.devocional,
                    currentStreak: 1,
                    lastActivityDate: todayDate,
                },
            });
        }
        else {
            const last = new Date(streak.lastActivityDate);
            last.setHours(0, 0, 0, 0);
            const diffDays = Math.floor((todayDate.getTime() - last.getTime()) / (24 * 60 * 60 * 1000));
            let newStreak = streak.currentStreak;
            if (diffDays === 0) {
            }
            else if (diffDays === 1) {
                newStreak = streak.currentStreak + 1;
            }
            else {
                newStreak = 1;
            }
            streak = await this.prisma.userStreak.update({
                where: { id: streak.id },
                data: {
                    currentStreak: newStreak,
                    lastActivityDate: todayDate,
                },
            });
        }
        const completedCount = await this.prisma.userDevocionalProgress.count({
            where: { userId, productId },
        });
        const totalDays = await this.prisma.devocionalDay.count({
            where: { productId },
        });
        await this.checkAndAwardBadges(userId, productId, completedCount, streak.currentStreak);
        return this.getDevocionalProgress(userId, productId);
    }
    async getPlannerProgress(userId, productId) {
        await this.ensureKitProduct(productId);
        const row = await this.prisma.userKitProgress.findUnique({
            where: {
                userId_productId: { userId, productId },
            },
        });
        const checks = row?.plannerChecks ?? {};
        return { checks };
    }
    async savePlannerProgress(userId, productId, dto) {
        await this.ensureKitProduct(productId);
        const checks = dto.checks ?? {};
        await this.prisma.userKitProgress.upsert({
            where: {
                userId_productId: { userId, productId },
            },
            create: {
                userId,
                productId,
                plannerChecks: checks,
            },
            update: {
                plannerChecks: checks,
            },
        });
        return { checks };
    }
    async checkAndAwardBadges(userId, productId, completedCount, currentStreak) {
        const badges = await this.prisma.badge.findMany({
            where: { productId },
        });
        for (const badge of badges) {
            const cond = badge.conditionValue;
            const type = badge.conditionType;
            let earned = false;
            if (type === 'days_completed' && cond?.days != null && completedCount >= cond.days) {
                earned = true;
            }
            if (type === 'streak_7' && currentStreak >= 7) {
                earned = true;
            }
            if (type === 'streak' && cond?.days != null && currentStreak >= cond.days) {
                earned = true;
            }
            if (!earned)
                continue;
            const existing = await this.prisma.userBadge.findUnique({
                where: {
                    userId_badgeId: { userId, badgeId: badge.id },
                },
            });
            if (!existing) {
                await this.prisma.userBadge.create({
                    data: { userId, badgeId: badge.id },
                });
            }
        }
    }
};
exports.UserProgressService = UserProgressService;
exports.UserProgressService = UserProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserProgressService);
//# sourceMappingURL=user-progress.service.js.map