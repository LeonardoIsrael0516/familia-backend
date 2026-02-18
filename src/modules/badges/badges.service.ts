import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(productId?: string) {
    return this.prisma.badge.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const badge = await this.prisma.badge.findUnique({
      where: { id },
    });
    if (!badge) throw new NotFoundException('Medalha não encontrada');
    return badge;
  }

  async create(dto: CreateBadgeDto) {
    return this.prisma.badge.create({
      data: {
        productId: dto.productId ?? null,
        code: dto.code,
        name: dto.name,
        description: dto.description ?? null,
        iconUrl: dto.iconUrl ?? null,
        conditionType: dto.conditionType,
        conditionValue: dto.conditionValue as object,
      },
    });
  }

  async update(id: string, dto: UpdateBadgeDto) {
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
          conditionValue: dto.conditionValue as object,
        }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.badge.delete({ where: { id } });
  }
}
