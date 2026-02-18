import { PrismaService } from '../../common/database/prisma.service';
import { CreateDevocionalDayDto } from './dto/create-devocional-day.dto';
import { UpdateDevocionalDayDto } from './dto/update-devocional-day.dto';
export declare class DevocionalService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private ensureProductIsDevocional;
    findAllByProductId(productId: string): Promise<{
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
    }[]>;
    findOne(productId: string, dayId: string): Promise<{
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
    }>;
    create(productId: string, dto: CreateDevocionalDayDto): Promise<{
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
    }>;
    update(productId: string, dayId: string, dto: UpdateDevocionalDayDto): Promise<{
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
    }>;
    remove(productId: string, dayId: string): Promise<void>;
}
