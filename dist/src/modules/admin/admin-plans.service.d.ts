import { PrismaService } from '../../common/database/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class AdminPlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        planProducts: ({
            product: {
                id: string;
                slug: string;
                title: string;
            };
        } & {
            productId: string;
            planId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        externalProductIdMonthly: string | null;
        externalProductIdSemiannual: string | null;
        externalProductIdAnnual: string | null;
    })[]>;
    findById(id: string): Promise<{
        planProducts: ({
            product: {
                id: string;
                slug: string;
                title: string;
            };
        } & {
            productId: string;
            planId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        externalProductIdMonthly: string | null;
        externalProductIdSemiannual: string | null;
        externalProductIdAnnual: string | null;
    }>;
    create(dto: CreatePlanDto): Promise<{
        planProducts: ({
            product: {
                id: string;
                slug: string;
                title: string;
            };
        } & {
            productId: string;
            planId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        externalProductIdMonthly: string | null;
        externalProductIdSemiannual: string | null;
        externalProductIdAnnual: string | null;
    }>;
    update(id: string, dto: UpdatePlanDto): Promise<{
        planProducts: ({
            product: {
                id: string;
                slug: string;
                title: string;
            };
        } & {
            productId: string;
            planId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        externalProductIdMonthly: string | null;
        externalProductIdSemiannual: string | null;
        externalProductIdAnnual: string | null;
    }>;
    remove(id: string): Promise<void>;
}
