import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ProductType } from '@prisma/client';
import { CreateDevocionalDayDto } from './dto/create-devocional-day.dto';
import { UpdateDevocionalDayDto } from './dto/update-devocional-day.dto';

@Injectable()
export class DevocionalService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProductIsDevocional(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (product.type !== ProductType.devocional) {
      throw new BadRequestException('Produto não é do tipo devocional');
    }
  }

  async findAllByProductId(productId: string) {
    await this.ensureProductIsDevocional(productId);
    return this.prisma.devocionalDay.findMany({
      where: { productId },
      orderBy: [{ sortOrder: 'asc' }, { dayNumber: 'asc' }],
    });
  }

  async findOne(productId: string, dayId: string) {
    await this.ensureProductIsDevocional(productId);
    const day = await this.prisma.devocionalDay.findFirst({
      where: { id: dayId, productId },
    });
    if (!day) throw new NotFoundException('Dia não encontrado');
    return day;
  }

  async create(productId: string, dto: CreateDevocionalDayDto) {
    await this.ensureProductIsDevocional(productId);
    const existing = await this.prisma.devocionalDay.findUnique({
      where: {
        productId_dayNumber: { productId, dayNumber: dto.dayNumber },
      },
    });
    if (existing) {
      throw new ConflictException(
        `Já existe um dia com número ${dto.dayNumber} neste produto`,
      );
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
        questions: dto.questions as unknown as object,
        audioPrayerUrl: dto.audioPrayerUrl ?? null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(
    productId: string,
    dayId: string,
    dto: UpdateDevocionalDayDto,
  ) {
    await this.findOne(productId, dayId);
    if (dto.dayNumber != null) {
      const existing = await this.prisma.devocionalDay.findUnique({
        where: {
          productId_dayNumber: { productId, dayNumber: dto.dayNumber },
        },
      });
      if (existing && existing.id !== dayId) {
        throw new ConflictException(
          `Já existe um dia com número ${dto.dayNumber} neste produto`,
        );
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
          questions: dto.questions as unknown as object,
        }),
        ...(dto.audioPrayerUrl !== undefined && {
          audioPrayerUrl: dto.audioPrayerUrl ?? null,
        }),
        ...(dto.sortOrder != null && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async remove(productId: string, dayId: string) {
    await this.findOne(productId, dayId);
    await this.prisma.devocionalDay.delete({ where: { id: dayId } });
  }
}
