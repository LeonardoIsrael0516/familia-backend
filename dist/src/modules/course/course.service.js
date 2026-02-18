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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
let CourseService = class CourseService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureProductIsCurso(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Produto não encontrado');
        if (product.type !== client_1.ProductType.curso) {
            throw new common_1.BadRequestException('Produto não é do tipo curso');
        }
    }
    async getModuleAndEnsureProduct(productId, moduleId) {
        await this.ensureProductIsCurso(productId);
        const module = await this.prisma.courseModule.findFirst({
            where: { id: moduleId, productId },
        });
        if (!module)
            throw new common_1.NotFoundException('Módulo não encontrado');
        return module;
    }
    async findAllModulesByProductId(productId) {
        await this.ensureProductIsCurso(productId);
        return this.prisma.courseModule.findMany({
            where: { productId },
            orderBy: { sortOrder: 'asc' },
            include: { lessons: { orderBy: { sortOrder: 'asc' } } },
        });
    }
    async findOneModule(productId, moduleId) {
        const mod = await this.getModuleAndEnsureProduct(productId, moduleId);
        return this.prisma.courseModule.findUnique({
            where: { id: mod.id },
            include: { lessons: { orderBy: { sortOrder: 'asc' } } },
        });
    }
    async createModule(productId, dto) {
        await this.ensureProductIsCurso(productId);
        return this.prisma.courseModule.create({
            data: {
                productId,
                title: dto.title,
                description: dto.description ?? null,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async updateModule(productId, moduleId, dto) {
        await this.getModuleAndEnsureProduct(productId, moduleId);
        return this.prisma.courseModule.update({
            where: { id: moduleId },
            data: {
                ...(dto.title != null && { title: dto.title }),
                ...(dto.description !== undefined && {
                    description: dto.description ?? null,
                }),
                ...(dto.sortOrder != null && { sortOrder: dto.sortOrder }),
            },
        });
    }
    async removeModule(productId, moduleId) {
        await this.getModuleAndEnsureProduct(productId, moduleId);
        await this.prisma.courseModule.delete({ where: { id: moduleId } });
    }
    async findAllLessons(productId, moduleId) {
        await this.getModuleAndEnsureProduct(productId, moduleId);
        return this.prisma.courseLesson.findMany({
            where: { moduleId },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOneLesson(productId, moduleId, lessonId) {
        await this.getModuleAndEnsureProduct(productId, moduleId);
        const lesson = await this.prisma.courseLesson.findFirst({
            where: { id: lessonId, moduleId },
        });
        if (!lesson)
            throw new common_1.NotFoundException('Aula não encontrada');
        return lesson;
    }
    async createLesson(productId, moduleId, dto) {
        await this.getModuleAndEnsureProduct(productId, moduleId);
        return this.prisma.courseLesson.create({
            data: {
                moduleId,
                title: dto.title,
                videoUrl: dto.videoUrl ?? null,
                summary: dto.summary ?? null,
                practicalQuestion: dto.practicalQuestion ?? null,
                durationMinutes: dto.durationMinutes ?? null,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async updateLesson(productId, moduleId, lessonId, dto) {
        await this.findOneLesson(productId, moduleId, lessonId);
        return this.prisma.courseLesson.update({
            where: { id: lessonId },
            data: {
                ...(dto.title != null && { title: dto.title }),
                ...(dto.videoUrl !== undefined && { videoUrl: dto.videoUrl ?? null }),
                ...(dto.summary !== undefined && { summary: dto.summary ?? null }),
                ...(dto.practicalQuestion !== undefined && {
                    practicalQuestion: dto.practicalQuestion ?? null,
                }),
                ...(dto.durationMinutes !== undefined && {
                    durationMinutes: dto.durationMinutes ?? null,
                }),
                ...(dto.sortOrder != null && { sortOrder: dto.sortOrder }),
            },
        });
    }
    async removeLesson(productId, moduleId, lessonId) {
        await this.findOneLesson(productId, moduleId, lessonId);
        await this.prisma.courseLesson.delete({ where: { id: lessonId } });
    }
};
exports.CourseService = CourseService;
exports.CourseService = CourseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CourseService);
//# sourceMappingURL=course.service.js.map