import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/database/prisma.service';

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(userId: string, content: string, imageUrl?: string) {
    return this.prisma.post.create({
      data: { userId, content, imageUrl: imageUrl ?? null },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });
  }

  async findPosts(userId: string, limit = 50, cursor?: string) {
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

  async createComment(userId: string, postId: string, content: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post não encontrado');
    return this.prisma.comment.create({
      data: { userId, postId, content },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async findCommentsByPostId(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async toggleLike(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post não encontrado');
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

  async deletePost(postId: string, userId: string, userRole: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post não encontrado');
    const canDelete = post.userId === userId || userRole === 'admin';
    if (!canDelete) {
      throw new ForbiddenException('Você não tem permissão para excluir este post');
    }
    await this.prisma.post.delete({ where: { id: postId } });
    return { deleted: true };
  }
}
