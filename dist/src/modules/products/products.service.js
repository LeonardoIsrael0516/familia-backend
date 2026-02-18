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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const library_1 = require("@prisma/client/runtime/library");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canUserAccessProduct(productId, userId) {
        const planProducts = await this.prisma.planProduct.findMany({
            where: { productId },
            include: { plan: true },
        });
        if (planProducts.length === 0)
            return true;
        const planIds = planProducts.map((pp) => pp.planId);
        const now = new Date();
        const activeSub = await this.prisma.subscription.findFirst({
            where: {
                userId,
                planId: { in: planIds },
                status: 'active',
                expiresAt: { gt: now },
            },
        });
        return !!activeSub;
    }
    async getAccessibleProductIds(userId) {
        const allProducts = await this.prisma.product.findMany({
            where: { active: true },
            select: { id: true },
        });
        const productIdsInPlans = await this.prisma.planProduct.findMany({
            select: { productId: true },
        });
        const inPlanSet = new Set(productIdsInPlans.map((p) => p.productId));
        const now = new Date();
        const userActiveSubs = await this.prisma.subscription.findMany({
            where: { userId, status: 'active', expiresAt: { gt: now } },
            include: { plan: { include: { planProducts: { select: { productId: true } } } } },
        });
        const accessibleFromSubs = new Set();
        for (const sub of userActiveSubs) {
            for (const pp of sub.plan.planProducts) {
                accessibleFromSubs.add(pp.productId);
            }
        }
        const result = new Set();
        for (const p of allProducts) {
            if (!inPlanSet.has(p.id))
                result.add(p.id);
            else if (accessibleFromSubs.has(p.id))
                result.add(p.id);
        }
        return result;
    }
    async findAll(userId, activeOnly = true) {
        const products = await this.prisma.product.findMany({
            where: activeOnly ? { active: true } : undefined,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
        const accessibleIds = await this.getAccessibleProductIds(userId);
        return products.map((p) => ({
            ...p,
            price: p.price.toString(),
            hasAccess: accessibleIds.has(p.id),
        }));
    }
    async findAllForAdmin(activeOnly = true) {
        const products = await this.prisma.product.findMany({
            where: activeOnly ? { active: true } : undefined,
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
        return products.map((p) => ({
            ...p,
            price: p.price.toString(),
        }));
    }
    async findBySlug(slug, userId) {
        const product = await this.prisma.product.findUnique({
            where: { slug, active: true },
        });
        if (!product)
            return null;
        const canAccess = await this.canUserAccessProduct(product.id, userId);
        if (!canAccess)
            throw new common_1.ForbiddenException('Você não tem acesso a este produto');
        return {
            ...product,
            price: product.price.toString(),
        };
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product)
            return null;
        return {
            ...product,
            price: product.price.toString(),
        };
    }
    async create(dto) {
        const existing = await this.prisma.product.findUnique({
            where: { slug: dto.slug },
        });
        if (existing) {
            throw new common_1.ConflictException('Já existe um produto com este slug');
        }
        const product = await this.prisma.product.create({
            data: {
                title: dto.title,
                slug: dto.slug,
                type: dto.type,
                price: new library_1.Decimal(dto.price),
                badge: dto.badge ?? null,
                tag: dto.tag ?? null,
                description: dto.description ?? null,
                imageUrl: dto.imageUrl ?? null,
                checkoutUrl: dto.checkoutUrl ?? null,
                comingSoon: dto.comingSoon ?? false,
                active: dto.active ?? true,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
        return {
            ...product,
            price: product.price.toString(),
        };
    }
    async update(id, dto) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        if (dto.slug && dto.slug !== product.slug) {
            const existing = await this.prisma.product.findUnique({
                where: { slug: dto.slug },
            });
            if (existing)
                throw new common_1.ConflictException('Já existe um produto com este slug');
        }
        const updated = await this.prisma.product.update({
            where: { id },
            data: {
                ...(dto.title != null && { title: dto.title }),
                ...(dto.slug != null && { slug: dto.slug }),
                ...(dto.type != null && { type: dto.type }),
                ...(dto.price != null && { price: new library_1.Decimal(dto.price) }),
                ...(dto.badge !== undefined && { badge: dto.badge ?? null }),
                ...(dto.tag !== undefined && { tag: dto.tag ?? null }),
                ...(dto.description !== undefined && { description: dto.description ?? null }),
                ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl ?? null }),
                ...(dto.checkoutUrl !== undefined && { checkoutUrl: dto.checkoutUrl ?? null }),
                ...(dto.comingSoon !== undefined && { comingSoon: dto.comingSoon }),
                ...(dto.active !== undefined && { active: dto.active }),
                ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
            },
        });
        return { ...updated, price: updated.price.toString() };
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        await this.prisma.product.delete({ where: { id } });
    }
    async findFullBySlug(slug, userId) {
        const product = await this.prisma.product.findUnique({
            where: { slug, active: true },
        });
        if (!product)
            return null;
        const canAccess = await this.canUserAccessProduct(product.id, userId);
        if (!canAccess)
            throw new common_1.ForbiddenException('Você não tem acesso a este produto');
        const base = {
            ...product,
            price: product.price.toString(),
        };
        if (product.type === 'devocional') {
            const [days, badges] = await Promise.all([
                this.prisma.devocionalDay.findMany({
                    where: { productId: product.id },
                    orderBy: [{ sortOrder: 'asc' }, { dayNumber: 'asc' }],
                }),
                this.prisma.badge.findMany({
                    where: { productId: product.id },
                    orderBy: { createdAt: 'asc' },
                }),
            ]);
            return {
                ...base,
                days,
                badges: badges.map((b) => ({
                    id: b.id,
                    code: b.code,
                    name: b.name,
                    description: b.description,
                    conditionType: b.conditionType,
                    conditionValue: b.conditionValue,
                    iconUrl: b.iconUrl,
                })),
            };
        }
        if (product.type === 'kit') {
            const sections = await this.prisma.kitSection.findMany({
                where: { productId: product.id },
                orderBy: { sortOrder: 'asc' },
            });
            return { ...base, sections };
        }
        if (product.type === 'curso') {
            const modules = await this.prisma.courseModule.findMany({
                where: { productId: product.id },
                orderBy: { sortOrder: 'asc' },
                include: {
                    lessons: { orderBy: { sortOrder: 'asc' } },
                },
            });
            return { ...base, modules };
        }
        return base;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map