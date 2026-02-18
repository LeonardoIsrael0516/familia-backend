import { CommunityService } from './community.service';
import { StorageService } from '../storage/storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
export declare class CommunityController {
    private readonly communityService;
    private readonly storage;
    constructor(communityService: CommunityService, storage: StorageService);
    upload(file: {
        fieldname: string;
        originalname: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
    }): Promise<{
        url: string;
    }>;
    createPost(userId: string, dto: CreatePostDto): Promise<{
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
    findPosts(userId: string, limit?: string, cursor?: string): Promise<{
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
    createComment(userId: string, postId: string, dto: CreateCommentDto): Promise<{
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
    findComments(postId: string): Promise<({
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
    deletePost(user: CurrentUserPayload, postId: string): Promise<{
        deleted: boolean;
    }>;
}
