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
exports.ContentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const products_service_1 = require("../products/products.service");
let ContentService = class ContentService {
    constructor(prisma, productsService) {
        this.prisma = prisma;
        this.productsService = productsService;
    }
    async findByProductId(productId, userId) {
        const canAccess = await this.productsService.canUserAccessProduct(productId, userId);
        if (!canAccess) {
            throw new common_1.ForbiddenException('Você não tem acesso a este produto');
        }
        const items = await this.prisma.contentItem.findMany({
            where: { productId },
            orderBy: { sortOrder: 'asc' },
        });
        return items.map((item) => ({
            id: item.id,
            productId: item.productId,
            type: item.type,
            metadata: item.metadata,
            sortOrder: item.sortOrder,
        }));
    }
};
exports.ContentService = ContentService;
exports.ContentService = ContentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        products_service_1.ProductsService])
], ContentService);
//# sourceMappingURL=content.service.js.map