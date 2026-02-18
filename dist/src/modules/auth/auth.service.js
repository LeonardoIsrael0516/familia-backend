"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../common/database/prisma.service");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
const crypto = require("crypto");
const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000;
let AuthService = class AuthService {
    constructor(usersService, jwtService, config, prisma, emailService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
        this.prisma = prisma;
        this.emailService = emailService;
    }
    async register(dto) {
        const user = await this.usersService.create({
            email: dto.email,
            name: dto.name,
            password: dto.password,
        });
        return this.issueTokens(user.id, user.email, user.name, user.role, user.avatarUrl ?? null);
    }
    async login(dto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const valid = await this.usersService.validatePassword(user, dto.password);
        if (!valid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        return this.issueTokens(user.id, user.email, user.name, user.role, user.avatarUrl ?? null);
    }
    async refresh(refreshToken) {
        const hash = this.hashToken(refreshToken);
        const stored = await this.prisma.refreshToken.findFirst({
            where: { token: hash, revoked: false },
            include: { user: true },
        });
        if (!stored || stored.expiresAt < new Date()) {
            if (stored) {
                await this.prisma.refreshToken.update({
                    where: { id: stored.id },
                    data: { revoked: true },
                });
            }
            throw new common_1.UnauthorizedException('Refresh token inválido ou expirado');
        }
        const { passwordHash: _, ...user } = stored.user;
        const tokens = await this.issueTokens(user.id, user.email, user.name, user.role, user.avatarUrl ?? null);
        return tokens;
    }
    async logout(refreshToken) {
        if (!refreshToken)
            return;
        const hash = this.hashToken(refreshToken);
        await this.prisma.refreshToken.updateMany({
            where: { token: hash },
            data: { revoked: true },
        });
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return;
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(token);
        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });
        const frontendUrl = this.config.get('app.frontendUrl') || '';
        const resetLink = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${token}`;
        await this.emailService.sendPasswordReset(user.email, resetLink);
    }
    async resetPassword(token, newPassword) {
        const tokenHash = this.hashToken(token);
        const record = await this.prisma.passwordResetToken.findFirst({
            where: { tokenHash },
            include: { user: true },
        });
        if (!record || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Link inválido ou expirado. Solicite um novo.');
        }
        await this.usersService.updatePassword(record.userId, newPassword);
        await this.prisma.passwordResetToken.delete({
            where: { id: record.id },
        });
    }
    async issueTokens(userId, email, name, role, avatarUrl) {
        const accessSecret = this.config.get('jwt.accessSecret');
        const accessExpiresIn = this.config.get('jwt.accessExpiresIn');
        const refreshSecret = this.config.get('jwt.refreshSecret');
        const refreshExpiresIn = this.config.get('jwt.refreshExpiresIn');
        if (!refreshExpiresIn) {
            throw new Error('JWT_REFRESH_EXPIRES_IN é obrigatório (ex.: 7d).');
        }
        const payload = { sub: userId, email, role };
        const accessToken = this.jwtService.sign(payload, {
            secret: accessSecret,
            expiresIn: accessExpiresIn,
        });
        const refreshTokenPlain = crypto.randomBytes(40).toString('hex');
        const refreshTokenHash = this.hashToken(refreshTokenPlain);
        const expiresAt = this.parseExpiresIn(refreshExpiresIn);
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token: refreshTokenHash,
                expiresAt,
            },
        });
        const decoded = this.jwtService.decode(accessToken);
        const expiresIn = decoded?.exp
            ? Math.max(0, decoded.exp - Math.floor(Date.now() / 1000))
            : 900;
        return {
            accessToken,
            refreshToken: refreshTokenPlain,
            expiresIn,
            user: { id: userId, email, name, role, avatarUrl: avatarUrl ?? null },
        };
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    parseExpiresIn(value) {
        const match = value.match(/^(\d+)([smhd])$/);
        if (!match)
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const num = parseInt(match[1], 10);
        const unit = match[2];
        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
        };
        return new Date(Date.now() + num * (multipliers[unit] ?? 86400000));
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        prisma_service_1.PrismaService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map