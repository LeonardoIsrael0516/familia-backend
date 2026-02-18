import { ProductsService } from '../products/products.service';
import { CreateProductDto } from '../products/dto/create-product.dto';
import { UpdateProductDto } from '../products/dto/update-product.dto';
export declare class AdminProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(): Promise<import("../products/products.service").ProductResponse[]>;
    findOne(id: string): Promise<import("../products/products.service").ProductResponse | null>;
    create(dto: CreateProductDto): Promise<{
        price: string;
        id: string;
        slug: string;
        title: string;
        type: import(".prisma/client").$Enums.ProductType;
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
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        price: string;
        id: string;
        slug: string;
        title: string;
        type: import(".prisma/client").$Enums.ProductType;
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
    }>;
    remove(id: string): Promise<void>;
}
