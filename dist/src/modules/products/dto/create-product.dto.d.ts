import { ProductType } from '@prisma/client';
export declare class CreateProductDto {
    title: string;
    slug: string;
    type: ProductType;
    price: number;
    badge?: string;
    tag?: string;
    description?: string;
    imageUrl?: string;
    checkoutUrl?: string;
    comingSoon?: boolean;
    active?: boolean;
    sortOrder?: number;
}
