import { PrismaService } from '../../common/database/prisma.service';
import { UsersService } from '../users/users.service';
import { PeriodType } from '@prisma/client';
export declare class AdminUsersService {
    private readonly prisma;
    private readonly usersService;
    constructor(prisma: PrismaService, usersService: UsersService);
    findAll(params: {
        search?: string;
        subscribersOnly?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            subscriptions: ({
                plan: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                status: import(".prisma/client").$Enums.SubscriptionStatus;
                planId: string;
                periodType: import(".prisma/client").$Enums.PeriodType;
                startsAt: Date;
                externalTransactionId: string | null;
            })[];
        }[];
        total: number;
    }>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        subscriptions: ({
            plan: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            status: import(".prisma/client").$Enums.SubscriptionStatus;
            planId: string;
            periodType: import(".prisma/client").$Enums.PeriodType;
            startsAt: Date;
            externalTransactionId: string | null;
        })[];
    }>;
    createUser(data: {
        email: string;
        name: string;
        password: string;
        role?: 'user' | 'admin';
    }): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
    }, "passwordHash">>;
    changePassword(userId: string, newPassword: string): Promise<void>;
    addSubscription(userId: string, planId: string, periodType: PeriodType, customExpiresAt?: Date): Promise<{
        plan: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        status: import(".prisma/client").$Enums.SubscriptionStatus;
        planId: string;
        periodType: import(".prisma/client").$Enums.PeriodType;
        startsAt: Date;
        externalTransactionId: string | null;
    }>;
}
