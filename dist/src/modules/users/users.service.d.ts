import { PrismaService } from '../../common/database/prisma.service';
import { User, Role } from '@prisma/client';
export type UserSafe = Pick<User, 'id' | 'email' | 'name' | 'role' | 'avatarUrl' | 'createdAt' | 'updatedAt'>;
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<UserSafe | null>;
    updateProfile(userId: string, data: {
        name?: string;
        avatarUrl?: string | null;
    }): Promise<UserSafe>;
    changePasswordForCurrentUser(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    create(data: {
        email: string;
        name: string;
        password: string;
        role?: Role;
    }): Promise<Omit<User, 'passwordHash'>>;
    validatePassword(user: User, password: string): Promise<boolean>;
    updatePassword(userId: string, newPassword: string): Promise<void>;
    findOrCreateByEmail(data: {
        email: string;
        name: string;
        password: string;
        role?: Role;
    }): Promise<{
        user: Omit<User, 'passwordHash'>;
        created: boolean;
    }>;
}
