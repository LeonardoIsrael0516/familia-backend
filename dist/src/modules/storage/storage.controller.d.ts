import { StorageService } from './storage.service';
export declare class StorageController {
    private readonly storage;
    constructor(storage: StorageService);
    upload(file: {
        fieldname: string;
        originalname: string;
        mimetype: string;
        buffer: Buffer;
        size: number;
    }): Promise<{
        url: string;
    }>;
}
