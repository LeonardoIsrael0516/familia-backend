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
exports.AdminUsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const users_service_1 = require("../users/users.service");
const PERIOD_DAYS = {
    monthly: 30,
    semiannual: 180,
    annual: 365,
};
let AdminUsersService = class AdminUsersService {
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
    }
    async findAll(params) {
        const { search, subscribersOnly, limit = 50, offset = 0 } = params;
        const where = {};
        if (search && search.trim()) {
            const term = `%${search.trim()}%`;
            where.OR = [
                { email: { contains: term, mode: 'insensitive' } },
                { name: { contains: term, mode: 'insensitive' } },
            ];
        }
        if (subscribersOnly) {
            where.subscriptions = {
                some: {
                    status: 'active',
                    expiresAt: { gt: new Date() },
                },
            };
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                take: Math.min(limit, 100),
                skip: offset,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                    subscriptions: {
                        where: { status: 'active', expiresAt: { gt: new Date() } },
                        include: { plan: { select: { id: true, name: true } } },
                    },
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return { items: users, total };
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                subscriptions: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        plan: { select: { id: true, name: true } },
                    },
                },
            },
        });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        return user;
    }
    async createUser(data) {
        return this.usersService.create({
            email: data.email,
            name: data.name,
            password: data.password,
            role: data.role ?? 'user',
        });
    }
    async changePassword(userId, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        await this.usersService.updatePassword(userId, newPassword);
    }
    async addSubscription(userId, planId, periodType, customExpiresAt) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Usuário não encontrado');
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan)
            throw new common_1.NotFoundException('Plano não encontrado');
        const startsAt = new Date();
        const expiresAt = customExpiresAt ??
            (() => {
                const d = new Date(startsAt);
                d.setDate(d.getDate() + PERIOD_DAYS[periodType]);
                return d;
            })();
        return this.prisma.subscription.create({
            data: {
                userId,
                planId,
                periodType,
                status: 'active',
                startsAt,
                expiresAt,
            },
            include: {
                plan: { select: { id: true, name: true } },
            },
        });
    }
};
exports.AdminUsersService = AdminUsersService;
exports.AdminUsersService = AdminUsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], AdminUsersService);
//# sourceMappingURL=admin-users.service.js.map