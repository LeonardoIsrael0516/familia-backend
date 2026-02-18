import { ContentService } from './content.service';
export declare class ContentController {
    private readonly contentService;
    constructor(contentService: ContentService);
    findByProductId(userId: string, productId: string): Promise<import("./content.service").ContentItemResponse[]>;
}
