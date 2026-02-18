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
export declare class ContentService {
    private readonly prisma;
    private readonly productsService;
    constructor(prisma: PrismaService, productsService: ProductsService);
    findByProductId(productId: string, userId: string): Promise<ContentItemResponse[]>;
}
