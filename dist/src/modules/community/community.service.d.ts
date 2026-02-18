import { PrismaService } from '../../common/database/prisma.service';
export declare class CommunityService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPost(userId: string, content: string, imageUrl?: string): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        content: string;
    }>;
    findPosts(userId: string, limit?: number, cursor?: string): Promise<{
        items: {
            id: string;
            content: string;
            imageUrl: string | null;
            createdAt: Date;
            author: string;
            authorId: string;
            initials: string;
            likes: number;
            likedByMe: boolean;
            comments: number;
        }[];
        nextCursor: string | null;
    }>;
    createComment(userId: string, postId: string, content: string): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    }>;
    findCommentsByPostId(postId: string): Promise<({
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        content: string;
        postId: string;
    })[]>;
    toggleLike(userId: string, postId: string): Promise<{
        liked: boolean;
    }>;
    deletePost(postId: string, userId: string, userRole: string): Promise<{
        deleted: boolean;
    }>;
}
