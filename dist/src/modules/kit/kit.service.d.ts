import { PrismaService } from '../../common/database/prisma.service';
import { CreateKitSectionDto } from './dto/create-kit-section.dto';
import { UpdateKitSectionDto } from './dto/update-kit-section.dto';
export declare class KitService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private ensureProductIsKit;
    findAllByProductId(productId: string): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        productId: string;
        sectionKey: import(".prisma/client").$Enums.KitSectionKey;
        config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findOne(productId: string, sectionId: string): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        productId: string;
        sectionKey: import(".prisma/client").$Enums.KitSectionKey;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    create(productId: string, dto: CreateKitSectionDto): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        productId: string;
        sectionKey: import(".prisma/client").$Enums.KitSectionKey;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(productId: string, sectionId: string, dto: UpdateKitSectionDto): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        productId: string;
        sectionKey: import(".prisma/client").$Enums.KitSectionKey;
        config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(productId: string, sectionId: string): Promise<void>;
}
