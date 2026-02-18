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
exports.BadgesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let BadgesService = class BadgesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(productId) {
        return this.prisma.badge.findMany({
            where: productId ? { productId } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const badge = await this.prisma.badge.findUnique({
            where: { id },
        });
        if (!badge)
            throw new common_1.NotFoundException('Medalha não encontrada');
        return badge;
    }
    async create(dto) {
        return this.prisma.badge.create({
            data: {
                productId: dto.productId ?? null,
                code: dto.code,
                name: dto.name,
                description: dto.description ?? null,
                iconUrl: dto.iconUrl ?? null,
                conditionType: dto.conditionType,
                conditionValue: dto.conditionValue,
            },
        });
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.badge.update({
            where: { id },
            data: {
                ...(dto.productId !== undefined && {
                    productId: dto.productId ?? null,
                }),
                ...(dto.code != null && { code: dto.code }),
                ...(dto.name != null && { name: dto.name }),
                ...(dto.description !== undefined && {
                    description: dto.description ?? null,
                }),
                ...(dto.iconUrl !== undefined && { iconUrl: dto.iconUrl ?? null }),
                ...(dto.conditionType != null && {
                    conditionType: dto.conditionType,
                }),
                ...(dto.conditionValue != null && {
                    conditionValue: dto.conditionValue,
                }),
            },
        });
    }
    async remove(id) {
        await this.findOne(id);
        await this.prisma.badge.delete({ where: { id } });
    }
};
exports.BadgesService = BadgesService;
exports.BadgesService = BadgesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BadgesService);
//# sourceMappingURL=badges.service.js.map