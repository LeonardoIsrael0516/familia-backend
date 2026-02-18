import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';
import { User, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export type UserSafe = Pick<User, 'id' | 'email' | 'name' | 'role' | 'avatarUrl' | 'createdAt' | 'updatedAt'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async findById(id: string): Promise<UserSafe | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: { name?: string; avatarUrl?: string | null },
  ): Promise<UserSafe> {
    const updateData: { name?: string; avatarUrl?: string | null } = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }

  async changePasswordForCurrentUser(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) return;
    const valid = await this.validatePassword(user, currentPassword);
    if (!valid) {
      throw new UnauthorizedException('Senha atual incorreta');
    }
    await this.updatePassword(userId, newPassword);
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: Role;
  }): Promise<Omit<User, 'passwordHash'>> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);
    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name.trim(),
        passwordHash,
        role: data.role ?? Role.user,
      },
    });
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async findOrCreateByEmail(data: {
    email: string;
    name: string;
    password: string;
    role?: Role;
  }): Promise<{ user: Omit<User, 'passwordHash'>; created: boolean }> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      const { passwordHash: _, ...result } = existing;
      return { user: result, created: false };
    }
    const user = await this.create(data);
    return { user, created: true };
  }
}
