import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { StorageService, type UploadedFile as UploadedFileType } from '../storage/storage.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordCurrentUserDto } from './dto/change-password-current-user.dto';

const AVATAR_MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_AVATAR_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storage: StorageService,
  ) {}

  @Get('profile')
  getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl }),
    });
  }

  @Patch('password')
  changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordCurrentUserDto,
  ) {
    return this.usersService.changePasswordForCurrentUser(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Post('avatar-upload')
  @UseInterceptors(FileInterceptor('file'))
  async avatarUpload(
    @CurrentUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: AVATAR_MAX_SIZE_BYTES,
            message: 'Arquivo muito grande. Máximo 2 MB.',
          }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|gif|webp)$/,
          }),
        ],
        fileIsRequired: true,
        exceptionFactory: (err: string) =>
          new BadRequestException(
            err ??
              'Nenhum arquivo enviado. Envie uma imagem (JPEG, PNG, GIF ou WebP) no campo "file".',
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
    const mime = (file.mimetype || '').toLowerCase();
    if (!ALLOWED_AVATAR_MIMES.includes(mime)) {
      throw new BadRequestException(
        'Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.',
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
      'avatars',
    );
    return result;
  }
}
