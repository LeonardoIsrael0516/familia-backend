import { PrismaService } from '../../common/database/prisma.service';
import { SaveDevocionalProgressDto } from './dto/save-progress.dto';
import { SavePlannerProgressDto } from './dto/save-planner-progress.dto';
export declare class UserProgressService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private ensureKitProduct;
    private ensureDevocionalProduct;
    getDevocionalProgress(userId: string, productId: string): Promise<{
        completedDayNumbers: number[];
        completedCount: number;
        progressByDay: {
            dayNumber: number;
            completedAt: Date;
            notes: string | null;
        }[];
        streak: {
            currentStreak: number;
            lastActivityDate: Date;
        } | {
            currentStreak: number;
            lastActivityDate: null;
        };
        badges: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            iconUrl: string | null;
            earnedAt: Date;
        }[];
    }>;
    saveDevocionalProgress(userId: string, productId: string, dto: SaveDevocionalProgressDto): Promise<{
        completedDayNumbers: number[];
        completedCount: number;
        progressByDay: {
            dayNumber: number;
            completedAt: Date;
            notes: string | null;
        }[];
        streak: {
            currentStreak: number;
            lastActivityDate: Date;
        } | {
            currentStreak: number;
            lastActivityDate: null;
        };
        badges: {
            id: string;
            code: string;
            name: string;
            description: string | null;
            iconUrl: string | null;
            earnedAt: Date;
        }[];
    }>;
    getPlannerProgress(userId: string, productId: string): Promise<{
        checks: Record<string, boolean>;
    }>;
    savePlannerProgress(userId: string, productId: string, dto: SavePlannerProgressDto): Promise<{
        checks: Record<string, boolean>;
    }>;
    private checkAndAwardBadges;
}
