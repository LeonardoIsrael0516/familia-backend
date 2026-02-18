import { KitSectionKey } from '@prisma/client';
export declare class UpdateKitSectionDto {
    sectionKey?: KitSectionKey;
    title?: string;
    config?: Record<string, unknown>;
    sortOrder?: number;
}
