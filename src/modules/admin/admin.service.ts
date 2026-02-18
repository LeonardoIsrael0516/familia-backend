import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Role } from '@prisma/client';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly config: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async createAdmin(dto: CreateAdminDto): Promise<{ id: string; email: string; name: string; role: string }> {
    const setupSecret = this.config.get<string>('admin.setupSecret');
    if (!setupSecret || setupSecret.length < 16) {
      throw new UnauthorizedException('Setup de admin não configurado ou segredo inválido');
    }
    if (dto.secret !== setupSecret) {
      throw new UnauthorizedException('Segredo inválido');
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Já existe um usuário com este e-mail');
    }

    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: dto.password,
      role: Role.admin,
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
