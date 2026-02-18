import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
export declare class AdminBadgesController {
    private readonly badgesService;
    constructor(badgesService: BadgesService);
    findAll(productId?: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        productId: string | null;
        code: string;
        iconUrl: string | null;
        conditionType: string;
        conditionValue: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        productId: string | null;
        code: string;
        iconUrl: string | null;
        conditionType: string;
        conditionValue: import("@prisma/client/runtime/library").JsonValue;
    }>;
    create(dto: CreateBadgeDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        productId: string | null;
        code: string;
        iconUrl: string | null;
        conditionType: string;
        conditionValue: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(id: string, dto: UpdateBadgeDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        productId: string | null;
        code: string;
        iconUrl: string | null;
        conditionType: string;
        conditionValue: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<void>;
}
