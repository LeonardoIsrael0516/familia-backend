import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminGuard } from '../../common/guards/admin.guard';
import { StorageService, type UploadedFile as UploadedFileType } from './storage.service';

const DEFAULT_MAX_SIZE_MB = 50;
const DEFAULT_MAX_SIZE_BYTES = DEFAULT_MAX_SIZE_MB * 1024 * 1024;

@Controller('admin')
@UseGuards(AdminGuard)
export class StorageController {
  constructor(private readonly storage: StorageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: DEFAULT_MAX_SIZE_BYTES,
            message: 'Arquivo muito grande.',
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
      'media',
    );
    return result;
  }
}
