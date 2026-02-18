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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    constructor(config, usersService) {
        this.config = config;
        this.usersService = usersService;
    }
    async createAdmin(dto) {
        const setupSecret = this.config.get('admin.setupSecret');
        if (!setupSecret || setupSecret.length < 16) {
            throw new common_1.UnauthorizedException('Setup de admin não configurado ou segredo inválido');
        }
        if (dto.secret !== setupSecret) {
            throw new common_1.UnauthorizedException('Segredo inválido');
        }
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Já existe um usuário com este e-mail');
        }
        const user = await this.usersService.create({
            email: dto.email,
            name: dto.name,
            password: dto.password,
            role: client_1.Role.admin,
        });
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], AdminService);
//# sourceMappingURL=admin.service.js.map