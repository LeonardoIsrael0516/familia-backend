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
exports.AdminPlansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let AdminPlansService = class AdminPlansService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.plan.findMany({
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
            include: {
                planProducts: {
                    include: { product: { select: { id: true, title: true, slug: true } } },
                },
            },
        });
    }
    async findById(id) {
        const plan = await this.prisma.plan.findUnique({
            where: { id },
            include: {
                planProducts: {
                    include: { product: { select: { id: true, title: true, slug: true } } },
                },
            },
        });
        if (!plan)
            throw new common_1.NotFoundException('Plano não encontrado');
        return plan;
    }
    async create(dto) {
        const { productIds, ...data } = dto;
        const plan = await this.prisma.plan.create({
            data: {
                name: data.name,
                description: data.description ?? null,
                externalProductIdMonthly: data.externalProductIdMonthly || null,
                externalProductIdSemiannual: data.externalProductIdSemiannual || null,
                externalProductIdAnnual: data.externalProductIdAnnual || null,
                sortOrder: data.sortOrder ?? 0,
            },
        });
        if (productIds && productIds.length > 0) {
            await this.prisma.planProduct.createMany({
                data: productIds.map((productId) => ({
                    planId: plan.id,
                    productId,
                })),
                skipDuplicates: true,
            });
        }
        return this.findById(plan.id);
    }
    async update(id, dto) {
        await this.findById(id);
        const { productIds, ...data } = dto;
        await this.prisma.plan.update({
            where: { id },
            data: {
                ...(data.name != null && { name: data.name }),
                ...(data.description !== undefined && { description: data.description ?? null }),
                ...(data.externalProductIdMonthly !== undefined && {
                    externalProductIdMonthly: data.externalProductIdMonthly || null,
                }),
                ...(data.externalProductIdSemiannual !== undefined && {
                    externalProductIdSemiannual: data.externalProductIdSemiannual || null,
                }),
                ...(data.externalProductIdAnnual !== undefined && {
                    externalProductIdAnnual: data.externalProductIdAnnual || null,
                }),
                ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
            },
        });
        if (productIds !== undefined) {
            await this.prisma.planProduct.deleteMany({ where: { planId: id } });
            if (productIds.length > 0) {
                await this.prisma.planProduct.createMany({
                    data: productIds.map((productId) => ({ planId: id, productId })),
                    skipDuplicates: true,
                });
            }
        }
        return this.findById(id);
    }
    async remove(id) {
        await this.findById(id);
        await this.prisma.plan.delete({ where: { id } });
    }
};
exports.AdminPlansService = AdminPlansService;
exports.AdminPlansService = AdminPlansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminPlansService);
//# sourceMappingURL=admin-plans.service.js.map