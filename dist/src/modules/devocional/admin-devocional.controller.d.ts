import { DevocionalService } from './devocional.service';
import { CreateDevocionalDayDto } from './dto/create-devocional-day.dto';
import { UpdateDevocionalDayDto } from './dto/update-devocional-day.dto';
export declare class AdminDevocionalController {
    private readonly devocionalService;
    constructor(devocionalService: DevocionalService);
    findAll(productId: string): Promise<{
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
