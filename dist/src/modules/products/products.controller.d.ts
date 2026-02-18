import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(userId: string): Promise<import("./products.service").ProductResponse[]>;
    findFullBySlug(userId: string, slug: string): Promise<{
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
    } | {
        days: {
            wordMeaning: string | null;
            wordOriginal: string | null;
            id: string;
            sortOrder: number;
            createdAt: Date;
            dayNumber: number;
            theme: string;
            verse: string;
            reflection: string;
            questions: import("@prisma/client/runtime/library").JsonValue;
            audioPrayerUrl: string | null;
            productId: string;
        }[];
        badges: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            conditionType: string;
            conditionValue: import("@prisma/client/runtime/library").JsonValue;
            iconUrl: string | null;
        }[];
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
    } | {
        sections: {
            id: string;
            title: string;
            sortOrder: number;
            createdAt: Date;
            productId: string;
            sectionKey: import(".prisma/client").$Enums.KitSectionKey;
            config: import("@prisma/client/runtime/library").JsonValue;
        }[];
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
    } | {
        modules: ({
            lessons: {
                id: string;
                title: string;
                sortOrder: number;
                createdAt: Date;
                videoUrl: string | null;
                summary: string | null;
                practicalQuestion: string | null;
                durationMinutes: number | null;
                moduleId: string;
            }[];
        } & {
            id: string;
            title: string;
            description: string | null;
            sortOrder: number;
            createdAt: Date;
            productId: string;
        })[];
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
    } | null>;
    findBySlug(userId: string, slug: string): Promise<import("./products.service").ProductResponse | null>;
}
