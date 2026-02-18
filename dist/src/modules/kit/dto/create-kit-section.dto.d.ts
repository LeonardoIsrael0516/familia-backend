import { KitSectionKey } from '@prisma/client';
export declare class CreateKitSectionDto {
    sectionKey: KitSectionKey;
    title: string;
    config: Record<string, unknown>;
    sortOrder?: number;
}
