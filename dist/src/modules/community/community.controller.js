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
exports.CommunityController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const throttler_1 = require("@nestjs/throttler");
const community_service_1 = require("./community.service");
const storage_service_1 = require("../storage/storage.service");
const create_post_dto_1 = require("./dto/create-post.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024;
let CommunityController = class CommunityController {
    constructor(communityService, storage) {
        this.communityService = communityService;
        this.storage = storage;
    }
    async upload(file) {
        if (!this.storage.isConfigured()) {
            throw new common_1.BadRequestException('Upload não disponível: Cloudflare R2 não configurado. Configure as variáveis R2_* na .env.');
        }
        const result = await this.storage.upload({
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype,
            buffer: file.buffer,
            size: file.size,
        }, 'community');
        return result;
    }
    createPost(userId, dto) {
        return this.communityService.createPost(userId, dto.content, dto.imageUrl);
    }
    findPosts(userId, limit, cursor) {
        const limitNum = limit ? Math.min(parseInt(limit, 10) || 50, 50) : 50;
        return this.communityService.findPosts(userId, limitNum, cursor);
    }
    createComment(userId, postId, dto) {
        return this.communityService.createComment(userId, postId, dto.content);
    }
    findComments(postId) {
        return this.communityService.findCommentsByPostId(postId);
    }
    toggleLike(userId, postId) {
        return this.communityService.toggleLike(userId, postId);
    }
    deletePost(user, postId) {
        return this.communityService.deletePost(postId, user.id, user.role);
    }
};
exports.CommunityController = CommunityController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [
            new common_1.MaxFileSizeValidator({
                maxSize: UPLOAD_MAX_SIZE_BYTES,
                message: 'Arquivo muito grande. Máximo 5 MB.',
            }),
        ],
        fileIsRequired: true,
        exceptionFactory: (err) => new common_1.BadRequestException(err ?? 'Nenhum arquivo enviado. Envie um arquivo no campo "file" (multipart/form-data).'),
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommunityController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)('posts'),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_post_dto_1.CreatePostDto]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)('posts'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "findPosts", null);
__decorate([
    (0, common_1.Post)('posts/:postId/comments'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('postId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_comment_dto_1.CreateCommentDto]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)('posts/:postId/comments'),
    __param(0, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "findComments", null);
__decorate([
    (0, common_1.Post)('posts/:postId/like'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "toggleLike", null);
__decorate([
    (0, common_1.Delete)('posts/:postId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('postId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CommunityController.prototype, "deletePost", null);
exports.CommunityController = CommunityController = __decorate([
    (0, common_1.Controller)('community'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [community_service_1.CommunityService,
        storage_service_1.StorageService])
], CommunityController);
//# sourceMappingURL=community.controller.js.map