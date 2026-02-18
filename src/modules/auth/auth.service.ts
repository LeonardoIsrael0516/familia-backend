import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/database/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from '../../common/strategies/jwt.strategy';
import * as crypto from 'crypto';

const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000; // 1 hour

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: { id: string; email: string; name: string; role: string; avatarUrl?: string | null };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
    });
    return this.issueTokens(user.id, user.email, user.name, user.role, user.avatarUrl ?? null);
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const valid = await this.usersService.validatePassword(user, dto.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return this.issueTokens(user.id, user.email, user.name, user.role, user.avatarUrl ?? null);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
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
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
    const { passwordHash: _, ...user } = stored.user;
    const tokens = await this.issueTokens(user.id, user.email, user.name, user.role, user.avatarUrl ?? null);
    // Não revoga o token ao usar: evita 401 no F5 (race/double request). O token continua válido até expiresAt.
    return tokens;
  }

  async logout(refreshToken: string | null): Promise<void> {
    if (!refreshToken) return;
    const hash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { token: hash },
      data: { revoked: true },
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return; // same response either way
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
    const frontendUrl = this.config.get<string>('app.frontendUrl') || '';
    const resetLink = `${frontendUrl.replace(/\/$/, '')}/reset-password?token=${token}`;
    await this.emailService.sendPasswordReset(user.email, resetLink);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = this.hashToken(token);
    const record = await this.prisma.passwordResetToken.findFirst({
      where: { tokenHash },
      include: { user: true },
    });
    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Link inválido ou expirado. Solicite um novo.');
    }
    await this.usersService.updatePassword(record.userId, newPassword);
    await this.prisma.passwordResetToken.delete({
      where: { id: record.id },
    });
  }

  private async issueTokens(
    userId: string,
    email: string,
    name: string,
    role: string,
    avatarUrl?: string | null,
  ): Promise<AuthTokens> {
    const accessSecret = this.config.get<string>('jwt.accessSecret');
    const accessExpiresIn = this.config.get<string>('jwt.accessExpiresIn');
    const refreshSecret = this.config.get<string>('jwt.refreshSecret');
    const refreshExpiresIn = this.config.get<string>('jwt.refreshExpiresIn');
    if (!refreshExpiresIn) {
      throw new Error('JWT_REFRESH_EXPIRES_IN é obrigatório (ex.: 7d).');
    }

    const payload: JwtPayload = { sub: userId, email, role };
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

    const decoded = this.jwtService.decode(accessToken) as { exp?: number };
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

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private parseExpiresIn(value: string): Date {
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const num = parseInt(match[1], 10);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    return new Date(Date.now() + num * (multipliers[unit] ?? 86400000));
  }
}
