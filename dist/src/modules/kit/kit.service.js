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
exports.KitService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
let KitService = class KitService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureProductIsKit(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        if (product.type !== client_1.ProductType.kit) {
            throw new common_1.BadRequestException('Produto não é do tipo kit');
        }
    }
    async findAllByProductId(productId) {
        await this.ensureProductIsKit(productId);
        return this.prisma.kitSection.findMany({
            where: { productId },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(productId, sectionId) {
        await this.ensureProductIsKit(productId);
        const section = await this.prisma.kitSection.findFirst({
            where: { id: sectionId, productId },
        });
        if (!section)
            throw new common_1.NotFoundException('Seção não encontrada');
        return section;
    }
    async create(productId, dto) {
        await this.ensureProductIsKit(productId);
        return this.prisma.kitSection.create({
            data: {
                productId,
                sectionKey: dto.sectionKey,
                title: dto.title,
                config: dto.config,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async update(productId, sectionId, dto) {
        await this.findOne(productId, sectionId);
        return this.prisma.kitSection.update({
            where: { id: sectionId },
            data: {
                ...(dto.sectionKey != null && { sectionKey: dto.sectionKey }),
                ...(dto.title != null && { title: dto.title }),
                ...(dto.config != null && { config: dto.config }),
                ...(dto.sortOrder != null && { sortOrder: dto.sortOrder }),
            },
        });
    }
    async remove(productId, sectionId) {
        await this.findOne(productId, sectionId);
        await this.prisma.kitSection.delete({ where: { id: sectionId } });
    }
};
exports.KitService = KitService;
exports.KitService = KitService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KitService);
//# sourceMappingURL=kit.service.js.map