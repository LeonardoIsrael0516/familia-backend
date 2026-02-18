import { WebhookService } from './webhook.service';
import { WebhookCheckoutDto } from './dto/webhook-checkout.dto';
import { ConfigService } from '@nestjs/config';
export declare class WebhookController {
    private readonly webhookService;
    private readonly config;
    constructor(webhookService: WebhookService, config: ConfigService);
    checkout(webhookSecret: string | undefined, starfyEvent: string | undefined, rawBody: WebhookCheckoutDto | Array<{
        body?: WebhookCheckoutDto;
    }>): Promise<{
        ok: boolean;
        userId: string;
        subscriptionId: string;
        message: string;
    } | {
        ok: boolean;
        userId: string;
        subscriptionId: string;
        message?: undefined;
    }>;
}
