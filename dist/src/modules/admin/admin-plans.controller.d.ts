import { AdminPlansService } from './admin-plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
export declare class AdminPlansController {
    private readonly plansService;
    constructor(plansService: AdminPlansService);
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
    findOne(id: string): Promise<{
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
