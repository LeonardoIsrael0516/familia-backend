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
exports.DevocionalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
let DevocionalService = class DevocionalService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureProductIsDevocional(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        if (product.type !== client_1.ProductType.devocional) {
            throw new common_1.BadRequestException('Produto não é do tipo devocional');
        }
    }
    async findAllByProductId(productId) {
        await this.ensureProductIsDevocional(productId);
        return this.prisma.devocionalDay.findMany({
            where: { productId },
            orderBy: [{ sortOrder: 'asc' }, { dayNumber: 'asc' }],
        });
    }
    async findOne(productId, dayId) {
        await this.ensureProductIsDevocional(productId);
        const day = await this.prisma.devocionalDay.findFirst({
            where: { id: dayId, productId },
        });
        if (!day)
            throw new common_1.NotFoundException('Dia não encontrado');
        return day;
    }
    async create(productId, dto) {
        await this.ensureProductIsDevocional(productId);
        const existing = await this.prisma.devocionalDay.findUnique({
            where: {
                productId_dayNumber: { productId, dayNumber: dto.dayNumber },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Já existe um dia com número ${dto.dayNumber} neste produto`);
        }
        return this.prisma.devocionalDay.create({
            data: {
                productId,
                dayNumber: dto.dayNumber,
                theme: dto.theme,
                verse: dto.verse,
                wordOriginal: dto.wordOriginal ?? null,
                wordMeaning: dto.wordMeaning ?? null,
                reflection: dto.reflection,
                questions: dto.questions,
                audioPrayerUrl: dto.audioPrayerUrl ?? null,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async update(productId, dayId, dto) {
        await this.findOne(productId, dayId);
        if (dto.dayNumber != null) {
            const existing = await this.prisma.devocionalDay.findUnique({
                where: {
                    productId_dayNumber: { productId, dayNumber: dto.dayNumber },
                },
            });
            if (existing && existing.id !== dayId) {
                throw new common_1.ConflictException(`Já existe um dia com número ${dto.dayNumber} neste produto`);
            }
        }
        return this.prisma.devocionalDay.update({
            where: { id: dayId },
            data: {
                ...(dto.dayNumber != null && { dayNumber: dto.dayNumber }),
                ...(dto.theme != null && { theme: dto.theme }),
                ...(dto.verse != null && { verse: dto.verse }),
                ...(dto.wordOriginal !== undefined && {
                    wordOriginal: dto.wordOriginal ?? null,
                }),
                ...(dto.wordMeaning !== undefined && {
                    wordMeaning: dto.wordMeaning ?? null,
                }),
                ...(dto.reflection != null && { reflection: dto.reflection }),
                ...(dto.questions != null && {
                    questions: dto.questions,
                }),
                ...(dto.audioPrayerUrl !== undefined && {
                    audioPrayerUrl: dto.audioPrayerUrl ?? null,
                }),
                ...(dto.sortOrder != null && { sortOrder: dto.sortOrder }),
            },
        });
    }
    async remove(productId, dayId) {
        await this.findOne(productId, dayId);
        await this.prisma.devocionalDay.delete({ where: { id: dayId } });
    }
};
exports.DevocionalService = DevocionalService;
exports.DevocionalService = DevocionalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DevocionalService);
//# sourceMappingURL=devocional.service.js.map