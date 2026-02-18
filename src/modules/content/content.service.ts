import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ProductsService } from '../products/products.service';
import { ContentType } from '@prisma/client';

export interface ContentItemResponse {
  id: string;
  productId: string;
  type: ContentType;
  metadata: Record<string, unknown>;
  sortOrder: number;
}

@Injectable()
export class ContentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async findByProductId(productId: string, userId: string): Promise<ContentItemResponse[]> {
    const canAccess = await this.productsService.canUserAccessProduct(productId, userId);
    if (!canAccess) {
      throw new ForbiddenException('Você não tem acesso a este produto');
    }
    const items = await this.prisma.contentItem.findMany({
      where: { productId },
      orderBy: { sortOrder: 'asc' },
    });
    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      type: item.type,
      metadata: item.metadata as Record<string, unknown>,
      sortOrder: item.sortOrder,
    }));
  }
}
