import { PushService } from './push.service';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';
export declare class PushSubscriptionController {
    private readonly pushService;
    constructor(pushService: PushService);
    create(userId: string, dto: CreatePushSubscriptionDto, req: {
        headers?: {
            'user-agent'?: string;
        };
    }): Promise<{
        ok: boolean;
    }>;
}
