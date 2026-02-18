import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ProductType } from '@prisma/client';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProductIsCurso(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (product.type !== ProductType.curso) {
      throw new BadRequestException('Produto não é do tipo curso');
    }
  }

  private async getModuleAndEnsureProduct(productId: string, moduleId: string) {
    await this.ensureProductIsCurso(productId);
    const module = await this.prisma.courseModule.findFirst({
      where: { id: moduleId, productId },
    });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    return module;
  }

  async findAllModulesByProductId(productId: string) {
    await this.ensureProductIsCurso(productId);
    return this.prisma.courseModule.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
      include: { lessons: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async findOneModule(productId: string, moduleId: string) {
    const mod = await this.getModuleAndEnsureProduct(productId, moduleId);
    return this.prisma.courseModule.findUnique({
      where: { id: mod.id },
      include: { lessons: { orderBy: { sortOrder: 'asc' } } },
    });
  }

  async createModule(productId: string, dto: CreateCourseModuleDto) {
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

  async updateModule(
    productId: string,
    moduleId: string,
    dto: UpdateCourseModuleDto,
  ) {
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

  async removeModule(productId: string, moduleId: string) {
    await this.getModuleAndEnsureProduct(productId, moduleId);
    await this.prisma.courseModule.delete({ where: { id: moduleId } });
  }

  async findAllLessons(productId: string, moduleId: string) {
    await this.getModuleAndEnsureProduct(productId, moduleId);
    return this.prisma.courseLesson.findMany({
      where: { moduleId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOneLesson(
    productId: string,
    moduleId: string,
    lessonId: string,
  ) {
    await this.getModuleAndEnsureProduct(productId, moduleId);
    const lesson = await this.prisma.courseLesson.findFirst({
      where: { id: lessonId, moduleId },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    return lesson;
  }

  async createLesson(
    productId: string,
    moduleId: string,
    dto: CreateCourseLessonDto,
  ) {
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

  async updateLesson(
    productId: string,
    moduleId: string,
    lessonId: string,
    dto: UpdateCourseLessonDto,
  ) {
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

  async removeLesson(
    productId: string,
    moduleId: string,
    lessonId: string,
  ) {
    await this.findOneLesson(productId, moduleId, lessonId);
    await this.prisma.courseLesson.delete({ where: { id: lessonId } });
  }
}
