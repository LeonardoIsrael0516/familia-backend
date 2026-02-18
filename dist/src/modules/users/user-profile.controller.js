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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const users_service_1 = require("./users.service");
const storage_service_1 = require("../storage/storage.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const change_password_current_user_dto_1 = require("./dto/change-password-current-user.dto");
const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
let UserProfileController = class UserProfileController {
    constructor(usersService, storage) {
        this.usersService = usersService;
        this.storage = storage;
    }
    getProfile(userId) {
        return this.usersService.findById(userId);
    }
    updateProfile(userId, dto) {
        return this.usersService.updateProfile(userId, {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
        });
    }
    changePassword(userId, dto) {
        return this.usersService.changePasswordForCurrentUser(userId, dto.currentPassword, dto.newPassword);
    }
    async avatarUpload(userId, file) {
        if (!this.storage.isConfigured()) {
            throw new common_1.BadRequestException('Upload não disponível: Cloudflare R2 não configurado. Configure as variáveis R2_* na .env.');
        }
        const mime = (file.mimetype || '').toLowerCase();
        if (!ALLOWED_AVATAR_MIMES.includes(mime)) {
            throw new common_1.BadRequestException('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.');
        }
        const result = await this.storage.upload({
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            buffer: file.buffer,
            size: file.size,
        }, 'avatars');
        return result;
    }
};
exports.UserProfileController = UserProfileController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], UserProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('password'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_current_user_dto_1.ChangePasswordCurrentUserDto]),
    __metadata("design:returntype", void 0)
], UserProfileController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('avatar-upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({
                maxSize: AVATAR_MAX_SIZE_BYTES,
                message: 'Arquivo muito grande. Máximo 2 MB.',
            }),
            new common_1.FileTypeValidator({
                fileType: /^image\/(jpeg|png|gif|webp)$/,
            }),
        ],
        fileIsRequired: true,
        exceptionFactory: (err) => new common_1.BadRequestException(err ??
            'Nenhum arquivo enviado. Envie uma imagem (JPEG, PNG, GIF ou WebP) no campo "file".'),
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserProfileController.prototype, "avatarUpload", null);
exports.UserProfileController = UserProfileController = __decorate([
    (0, common_1.Controller)('user'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        storage_service_1.StorageService])
], UserProfileController);
//# sourceMappingURL=user-profile.controller.js.map