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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    }
    async findById(id) {
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
    async updateProfile(userId, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name.trim();
        if (data.avatarUrl !== undefined)
            updateData.avatarUrl = data.avatarUrl;
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
    async changePasswordForCurrentUser(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user)
            return;
        const valid = await this.validatePassword(user, currentPassword);
        if (!valid) {
            throw new common_1.UnauthorizedException('Senha atual incorreta');
        }
        await this.updatePassword(userId, newPassword);
    }
    async create(data) {
        const existing = await this.findByEmail(data.email);
        if (existing) {
            throw new common_1.ConflictException('Email já cadastrado');
        }
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(data.password, saltRounds);
        const user = await this.prisma.user.create({
            data: {
                email: data.email.toLowerCase(),
                name: data.name.trim(),
                passwordHash,
                role: data.role ?? client_1.Role.user,
            },
        });
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async validatePassword(user, password) {
        return bcrypt.compare(password, user.passwordHash);
    }
    async updatePassword(userId, newPassword) {
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    }
    async findOrCreateByEmail(data) {
        const existing = await this.findByEmail(data.email);
        if (existing) {
            const { passwordHash: _, ...result } = existing;
            return { user: result, created: false };
        }
        const user = await this.create(data);
        return { user, created: true };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map