import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class AdminPlansService {
  constructor(private readonly prisma: PrismaService) {}

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

  async findById(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        planProducts: {
          include: { product: { select: { id: true, title: true, slug: true } } },
        },
      },
    });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    return plan;
  }

  async create(dto: CreatePlanDto) {
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

  async update(id: string, dto: UpdatePlanDto) {
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

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.plan.delete({ where: { id } });
  }
}
