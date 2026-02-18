import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { ProductType } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Decimal } from '@prisma/client/runtime/library';

export interface ProductResponse {
  id: string;
  title: string;
  slug: string;
  type: ProductType;
  price: string;
  badge: string | null;
  tag: string | null;
  description: string | null;
  imageUrl: string | null;
  checkoutUrl: string | null;
  comingSoon: boolean;
  active: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  hasAccess?: boolean;
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async canUserAccessProduct(productId: string, userId: string): Promise<boolean> {
    const planProducts = await this.prisma.planProduct.findMany({
      where: { productId },
      include: { plan: true },
    });
    if (planProducts.length === 0) return true;
    const planIds = planProducts.map((pp) => pp.planId);
    const now = new Date();
    const activeSub = await this.prisma.subscription.findFirst({
      where: {
        userId,
        planId: { in: planIds },
        status: 'active',
        expiresAt: { gt: now },
      },
    });
    return !!activeSub;
  }

  private async getAccessibleProductIds(userId: string): Promise<Set<string>> {
    const allProducts = await this.prisma.product.findMany({
      where: { active: true },
      select: { id: true },
    });
    const productIdsInPlans = await this.prisma.planProduct.findMany({
      select: { productId: true },
    });
    const inPlanSet = new Set(productIdsInPlans.map((p) => p.productId));
    const now = new Date();
    const userActiveSubs = await this.prisma.subscription.findMany({
      where: { userId, status: 'active', expiresAt: { gt: now } },
      include: { plan: { include: { planProducts: { select: { productId: true } } } } },
    });
    const accessibleFromSubs = new Set<string>();
    for (const sub of userActiveSubs) {
      for (const pp of sub.plan.planProducts) {
        accessibleFromSubs.add(pp.productId);
      }
    }
    const result = new Set<string>();
    for (const p of allProducts) {
      if (!inPlanSet.has(p.id)) result.add(p.id);
      else if (accessibleFromSubs.has(p.id)) result.add(p.id);
    }
    return result;
  }

  async findAll(userId: string, activeOnly = true): Promise<ProductResponse[]> {
    const products = await this.prisma.product.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    const accessibleIds = await this.getAccessibleProductIds(userId);
    return products.map((p) => ({
      ...p,
      price: p.price.toString(),
      hasAccess: accessibleIds.has(p.id),
    }));
  }

  async findAllForAdmin(activeOnly = true): Promise<ProductResponse[]> {
    const products = await this.prisma.product.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
    return products.map((p) => ({
      ...p,
      price: p.price.toString(),
    }));
  }

  async findBySlug(slug: string, userId: string): Promise<ProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { slug, active: true },
    });
    if (!product) return null;
    const canAccess = await this.canUserAccessProduct(product.id, userId);
    if (!canAccess) throw new ForbiddenException('Você não tem acesso a este produto');
    return {
      ...product,
      price: product.price.toString(),
    };
  }

  async findById(id: string): Promise<ProductResponse | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) return null;
    return {
      ...product,
      price: product.price.toString(),
    };
  }

  async create(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });
    if (existing) {
      throw new ConflictException('Já existe um produto com este slug');
    }
    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        type: dto.type,
        price: new Decimal(dto.price),
        badge: dto.badge ?? null,
        tag: dto.tag ?? null,
        description: dto.description ?? null,
        imageUrl: dto.imageUrl ?? null,
        checkoutUrl: dto.checkoutUrl ?? null,
        comingSoon: dto.comingSoon ?? false,
        active: dto.active ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
    return {
      ...product,
      price: product.price.toString(),
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) throw new ConflictException('Já existe um produto com este slug');
    }
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.title != null && { title: dto.title }),
        ...(dto.slug != null && { slug: dto.slug }),
        ...(dto.type != null && { type: dto.type }),
        ...(dto.price != null && { price: new Decimal(dto.price) }),
        ...(dto.badge !== undefined && { badge: dto.badge ?? null }),
        ...(dto.tag !== undefined && { tag: dto.tag ?? null }),
        ...(dto.description !== undefined && { description: dto.description ?? null }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl ?? null }),
        ...(dto.checkoutUrl !== undefined && { checkoutUrl: dto.checkoutUrl ?? null }),
        ...(dto.comingSoon !== undefined && { comingSoon: dto.comingSoon }),
        ...(dto.active !== undefined && { active: dto.active }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
      },
    });
    return { ...updated, price: updated.price.toString() };
  }

  async remove(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    await this.prisma.product.delete({ where: { id } });
  }

  async findFullBySlug(slug: string, userId: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, active: true },
    });
    if (!product) return null;
    const canAccess = await this.canUserAccessProduct(product.id, userId);
    if (!canAccess) throw new ForbiddenException('Você não tem acesso a este produto');
    const base = {
      ...product,
      price: product.price.toString(),
    };
    if (product.type === 'devocional') {
      const [days, badges] = await Promise.all([
        this.prisma.devocionalDay.findMany({
          where: { productId: product.id },
          orderBy: [{ sortOrder: 'asc' }, { dayNumber: 'asc' }],
        }),
        this.prisma.badge.findMany({
          where: { productId: product.id },
          orderBy: { createdAt: 'asc' },
        }),
      ]);
      return {
        ...base,
        days,
        badges: badges.map((b) => ({
          id: b.id,
          code: b.code,
          name: b.name,
          description: b.description,
          conditionType: b.conditionType,
          conditionValue: b.conditionValue,
          iconUrl: b.iconUrl,
        })),
      };
    }
    if (product.type === 'kit') {
      const sections = await this.prisma.kitSection.findMany({
        where: { productId: product.id },
        orderBy: { sortOrder: 'asc' },
      });
      return { ...base, sections };
    }
    if (product.type === 'curso') {
      const modules = await this.prisma.courseModule.findMany({
        where: { productId: product.id },
        orderBy: { sortOrder: 'asc' },
        include: {
          lessons: { orderBy: { sortOrder: 'asc' } },
        },
      });
      return { ...base, modules };
    }
    return base;
  }
}
