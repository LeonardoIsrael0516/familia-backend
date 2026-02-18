export declare class CreateBadgeDto {
    productId?: string;
    code: string;
    name: string;
    description?: string;
    iconUrl?: string;
    conditionType: string;
    conditionValue: Record<string, unknown>;
}
