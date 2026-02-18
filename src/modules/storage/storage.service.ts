import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const DEFAULT_ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'video/mp4',
  'video/webm',
  'video/ogg',
];

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Injectable()
export class StorageService {
  private readonly s3: S3Client | null = null;
  private readonly bucketName: string | null = null;
  private readonly publicUrl: string | null = null;
  private readonly maxSizeBytes: number;
  private readonly allowedMimes: string[];

  constructor(private readonly config: ConfigService) {
    const accountId = this.config.get<string>('r2.accountId');
    const endpointOverride = this.config.get<string>('r2.endpoint');
    const accessKeyId = this.config.get<string>('r2.accessKeyId');
    const secretAccessKey = this.config.get<string>('r2.secretAccessKey');
    this.bucketName = this.config.get<string>('r2.bucketName') ?? null;
    this.publicUrl = this.config.get<string>('r2.publicUrl') ?? null;
    const maxSizeMb = this.config.get<number>('r2.uploadMaxSizeMb') ?? 50;
    this.maxSizeBytes = maxSizeMb * 1024 * 1024;
    const configuredMimes = this.config.get<string[]>('r2.uploadAllowedMimes');
    this.allowedMimes = configuredMimes?.length ? configuredMimes : DEFAULT_ALLOWED_MIMES;

    const endpoint = endpointOverride?.trim()
      ? endpointOverride.replace(/\/$/, '')
      : accountId
        ? `https://${accountId}.r2.cloudflarestorage.com`
        : null;

    if (endpoint && accessKeyId && secretAccessKey && this.bucketName && this.publicUrl) {
      this.s3 = new S3Client({
        region: 'auto',
        endpoint,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: true,
      });
    }
  }

  isConfigured(): boolean {
    return this.s3 != null && this.bucketName != null && this.publicUrl != null;
  }

  async upload(file: UploadedFile, prefix: string): Promise<{ url: string }> {
    if (!this.s3 || !this.bucketName || !this.publicUrl) {
      throw new ServiceUnavailableException(
        'Upload não disponível: Cloudflare R2 não configurado. Defina R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME e R2_PUBLIC_URL na .env.',
      );
    }

    if (file.size > this.maxSizeBytes) {
      const maxMb = Math.floor(this.maxSizeBytes / (1024 * 1024));
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo: ${maxMb} MB.`,
      );
    }

    const mime = (file.mimetype || '').toLowerCase();
    const allowed = this.allowedMimes.some(
      (a) => a === mime || (a.endsWith('/*') && mime.startsWith(a.replace('/*', ''))),
    );
    if (!allowed) {
      throw new BadRequestException(
        `Tipo de arquivo não permitido: ${file.mimetype}. Permitidos: ${this.allowedMimes.join(', ')}`,
      );
    }

    const ext = this.getExtension(file.originalname, file.mimetype);
    const key = `${prefix}/${randomUUID()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || 'application/octet-stream',
      }),
    );

    const base = this.publicUrl.endsWith('/') ? this.publicUrl.slice(0, -1) : this.publicUrl;
    const url = `${base}/${key}`;
    return { url };
  }

  private getExtension(originalname: string, mimetype: string): string {
    const fromName = originalname && /\.([a-zA-Z0-9]+)$/.exec(originalname)?.[1]?.toLowerCase();
    if (fromName) return `.${fromName}`;
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'audio/mpeg': '.mp3',
      'audio/mp3': '.mp3',
      'audio/wav': '.wav',
      'audio/ogg': '.ogg',
      'audio/webm': '.weba',
      'video/mp4': '.mp4',
      'video/webm': '.webm',
      'video/ogg': '.ogv',
    };
    return mimeToExt[mimetype?.toLowerCase()] ?? '.bin';
  }
}
