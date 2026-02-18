export declare class AddSubscriptionDto {
    planId: string;
    periodType: 'monthly' | 'semiannual' | 'annual';
    expiresAt?: string;
}
