import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/database/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
        avatarUrl?: string | null;
    };
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly config;
    private readonly prisma;
    private readonly emailService;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService, prisma: PrismaService, emailService: EmailService);
    register(dto: RegisterDto): Promise<AuthTokens>;
    login(dto: LoginDto): Promise<AuthTokens>;
    refresh(refreshToken: string): Promise<AuthTokens>;
    logout(refreshToken: string | null): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
    private issueTokens;
    private hashToken;
    private parseExpiresIn;
}
