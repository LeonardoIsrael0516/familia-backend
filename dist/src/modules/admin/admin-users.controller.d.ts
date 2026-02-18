import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AddSubscriptionDto } from './dto/add-subscription.dto';
export declare class AdminUsersController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    findAll(search?: string, subscribersOnly?: string, limit?: string, offset?: string): Promise<{
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
    create(dto: CreateUserDto): Promise<Omit<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        email: string;
        passwordHash: string;
        role: import(".prisma/client").$Enums.Role;
        avatarUrl: string | null;
    }, "passwordHash">>;
    findOne(id: string): Promise<{
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
    changePassword(id: string, dto: ChangePasswordDto): Promise<void>;
    addSubscription(id: string, dto: AddSubscriptionDto): Promise<{
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
