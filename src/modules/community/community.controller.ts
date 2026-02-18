import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { CommunityService } from './community.service';
import { StorageService, type UploadedFile as UploadedFileType } from '../storage/storage.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

const UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB para imagens de post

@Controller('community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
  constructor(
    private readonly communityService: CommunityService,
    private readonly storage: StorageService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: UPLOAD_MAX_SIZE_BYTES,
            message: 'Arquivo muito grande. Máximo 5 MB.',
          }),
        ],
        fileIsRequired: true,
        exceptionFactory: (err: string) =>
          new BadRequestException(
            err ?? 'Nenhum arquivo enviado. Envie um arquivo no campo "file" (multipart/form-data).',
          ),
      }),
    )
    file: { fieldname: string; originalname: string; mimetype: string; buffer: Buffer; size: number },
  ) {
    if (!this.storage.isConfigured()) {
      throw new BadRequestException(
        'Upload não disponível: Cloudflare R2 não configurado. Configure as variáveis R2_* na .env.',
      );
    }
    const result = await this.storage.upload(
      {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
        size: file.size,
      } as UploadedFileType,
      'community',
    );
    return result;
  }

  @Post('posts')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  createPost(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.communityService.createPost(userId, dto.content, dto.imageUrl);
  }

  @Get('posts')
  findPosts(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const limitNum = limit ? Math.min(parseInt(limit, 10) || 50, 50) : 50;
    return this.communityService.findPosts(userId, limitNum, cursor);
  }

  @Post('posts/:postId/comments')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  createComment(
    @CurrentUser('id') userId: string,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.communityService.createComment(userId, postId, dto.content);
  }

  @Get('posts/:postId/comments')
  findComments(@Param('postId') postId: string) {
    return this.communityService.findCommentsByPostId(postId);
  }

  @Post('posts/:postId/like')
  toggleLike(
    @CurrentUser('id') userId: string,
    @Param('postId') postId: string,
  ) {
    return this.communityService.toggleLike(userId, postId);
  }

  @Delete('posts/:postId')
  deletePost(
    @CurrentUser() user: CurrentUserPayload,
    @Param('postId') postId: string,
  ) {
    return this.communityService.deletePost(postId, user.id, user.role);
  }
}
