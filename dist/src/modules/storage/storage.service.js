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
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const crypto_1 = require("crypto");
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
let StorageService = class StorageService {
    constructor(config) {
        this.config = config;
        this.s3 = null;
        this.bucketName = null;
        this.publicUrl = null;
        const accountId = this.config.get('r2.accountId');
        const endpointOverride = this.config.get('r2.endpoint');
        const accessKeyId = this.config.get('r2.accessKeyId');
        const secretAccessKey = this.config.get('r2.secretAccessKey');
        this.bucketName = this.config.get('r2.bucketName') ?? null;
        this.publicUrl = this.config.get('r2.publicUrl') ?? null;
        const maxSizeMb = this.config.get('r2.uploadMaxSizeMb') ?? 50;
        this.maxSizeBytes = maxSizeMb * 1024 * 1024;
        const configuredMimes = this.config.get('r2.uploadAllowedMimes');
        this.allowedMimes = configuredMimes?.length ? configuredMimes : DEFAULT_ALLOWED_MIMES;
        const endpoint = endpointOverride?.trim()
            ? endpointOverride.replace(/\/$/, '')
            : accountId
                ? `https://${accountId}.r2.cloudflarestorage.com`
                : null;
        if (endpoint && accessKeyId && secretAccessKey && this.bucketName && this.publicUrl) {
            this.s3 = new client_s3_1.S3Client({
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
    isConfigured() {
        return this.s3 != null && this.bucketName != null && this.publicUrl != null;
    }
    async upload(file, prefix) {
        if (!this.s3 || !this.bucketName || !this.publicUrl) {
            throw new common_1.ServiceUnavailableException('Upload não disponível: Cloudflare R2 não configurado. Defina R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME e R2_PUBLIC_URL na .env.');
        }
        if (file.size > this.maxSizeBytes) {
            const maxMb = Math.floor(this.maxSizeBytes / (1024 * 1024));
            throw new common_1.BadRequestException(`Arquivo muito grande. Tamanho máximo: ${maxMb} MB.`);
        }
        const mime = (file.mimetype || '').toLowerCase();
        const allowed = this.allowedMimes.some((a) => a === mime || (a.endsWith('/*') && mime.startsWith(a.replace('/*', ''))));
        if (!allowed) {
            throw new common_1.BadRequestException(`Tipo de arquivo não permitido: ${file.mimetype}. Permitidos: ${this.allowedMimes.join(', ')}`);
        }
        const ext = this.getExtension(file.originalname, file.mimetype);
        const key = `${prefix}/${(0, crypto_1.randomUUID)()}${ext}`;
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype || 'application/octet-stream',
        }));
        const base = this.publicUrl.endsWith('/') ? this.publicUrl.slice(0, -1) : this.publicUrl;
        const url = `${base}/${key}`;
        return { url };
    }
    getExtension(originalname, mimetype) {
        const fromName = originalname && /\.([a-zA-Z0-9]+)$/.exec(originalname)?.[1]?.toLowerCase();
        if (fromName)
            return `.${fromName}`;
        const mimeToExt = {
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
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map