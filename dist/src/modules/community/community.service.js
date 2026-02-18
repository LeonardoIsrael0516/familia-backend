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
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/database/prisma.service");
let CommunityService = class CommunityService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPost(userId, content, imageUrl) {
        return this.prisma.post.create({
            data: { userId, content, imageUrl: imageUrl ?? null },
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });
    }
    async findPosts(userId, limit = 50, cursor) {
        const posts = await this.prisma.post.findMany({
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true },
                },
                _count: { select: { comments: true, likes: true } },
                likes: {
                    where: { userId },
                    select: { userId: true },
                },
            },
        });
        const hasMore = posts.length > limit;
        const items = hasMore ? posts.slice(0, limit) : posts;
        const nextCursor = hasMore ? items[items.length - 1].id : null;
        return {
            items: items.map((p) => ({
                id: p.id,
                content: p.content,
                imageUrl: p.imageUrl ?? null,
                createdAt: p.createdAt,
                author: p.user.name,
                authorId: p.user.id,
                initials: p.user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2),
                likes: p._count.likes,
                likedByMe: p.likes.length > 0,
                comments: p._count.comments,
            })),
            nextCursor,
        };
    }
    async createComment(userId, postId, content) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException('Post não encontrado');
        return this.prisma.comment.create({
            data: { userId, postId, content },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    }
    async findCommentsByPostId(postId) {
        return this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                user: { select: { id: true, name: true } },
            },
        });
    }
    async toggleLike(userId, postId) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException('Post não encontrado');
        const existing = await this.prisma.postLike.findUnique({
            where: { postId_userId: { postId, userId } },
        });
        if (existing) {
            await this.prisma.postLike.delete({
                where: { postId_userId: { postId, userId } },
            });
            return { liked: false };
        }
        await this.prisma.postLike.create({
            data: { postId, userId },
        });
        return { liked: true };
    }
    async deletePost(postId, userId, userRole) {
        const post = await this.prisma.post.findUnique({ where: { id: postId } });
        if (!post)
            throw new common_1.NotFoundException('Post não encontrado');
        const canDelete = post.userId === userId || userRole === 'admin';
        if (!canDelete) {
            throw new common_1.ForbiddenException('Você não tem permissão para excluir este post');
        }
        await this.prisma.post.delete({ where: { id: postId } });
        return { deleted: true };
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommunityService);
//# sourceMappingURL=community.service.js.map