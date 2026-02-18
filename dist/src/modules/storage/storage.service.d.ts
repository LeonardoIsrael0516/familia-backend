import { ConfigService } from '@nestjs/config';
export interface UploadedFile {
    fieldname: string;
    originalname: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
export declare class StorageService {
    private readonly config;
    private readonly s3;
    private readonly bucketName;
    private readonly publicUrl;
    private readonly maxSizeBytes;
    private readonly allowedMimes;
    constructor(config: ConfigService);
    isConfigured(): boolean;
    upload(file: UploadedFile, prefix: string): Promise<{
        url: string;
    }>;
    private getExtension;
}
