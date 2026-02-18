declare class PushKeysDto {
    p256dh: string;
    auth: string;
}
export declare class CreatePushSubscriptionDto {
    endpoint: string;
    keys: PushKeysDto;
}
export {};
