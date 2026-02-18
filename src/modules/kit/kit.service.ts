import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ProductType } from '@prisma/client';
import { CreateKitSectionDto } from './dto/create-kit-section.dto';
import { UpdateKitSectionDto } from './dto/update-kit-section.dto';

@Injectable()
export class KitService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureProductIsKit(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (product.type !== ProductType.kit) {
      throw new BadRequestException('Produto não é do tipo kit');
    }
  }

  async findAllByProductId(productId: string) {
    await this.ensureProductIsKit(productId);
    return this.prisma.kitSection.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(productId: string, sectionId: string) {
    await this.ensureProductIsKit(productId);
    const section = await this.prisma.kitSection.findFirst({
      where: { id: sectionId, productId },
    });
    if (!section) throw new NotFoundException('Seção não encontrada');
    return section;
  }

  async create(productId: string, dto: CreateKitSectionDto) {
    await this.ensureProductIsKit(productId);
    return this.prisma.kitSection.create({
      data: {
        productId,
        sectionKey: dto.sectionKey,
        title: dto.title,
        config: dto.config as object,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(productId: string, sectionId: string, dto: UpdateKitSectionDto) {
    await this.findOne(productId, sectionId);
    return this.prisma.kitSection.update({
      where: { id: sectionId },
      data: {
        ...(dto.sectionKey != null && { sectionKey: dto.sectionKey }),
        ...(dto.title != null && { title: dto.title }),
        ...(dto.config != null && { config: dto.config as object }),
        ...(dto.sortOrder != null && { sortOrder: dto.sortOrder }),
      },
    });
  }

  async remove(productId: string, sectionId: string) {
    await this.findOne(productId, sectionId);
    await this.prisma.kitSection.delete({ where: { id: sectionId } });
  }
}
