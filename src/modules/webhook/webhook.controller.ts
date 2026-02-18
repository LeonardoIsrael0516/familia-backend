import { Body, Controller, Post, Headers, BadRequestException } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { WebhookService } from './webhook.service';
import { WebhookCheckoutDto } from './dto/webhook-checkout.dto';
import { ConfigService } from '@nestjs/config';

@Controller('webhook')
@Public()
export class WebhookController {
  constructor(
    private readonly webhookService: WebhookService,
    private readonly config: ConfigService,
  ) {}

  @Post('checkout')
  async checkout(
    @Headers('x-webhook-secret') webhookSecret: string | undefined,
    @Headers('x-starfy-event') starfyEvent: string | undefined,
    @Body() rawBody: WebhookCheckoutDto | Array<{ body?: WebhookCheckoutDto }>,
  ) {
    const configuredSecret = this.config.get<string>('webhook.secret');
    if (!configuredSecret || configuredSecret.length < 16) {
      throw new BadRequestException('Webhook não configurado. Defina WEBHOOK_SECRET na .env (mín. 16 caracteres).');
    }
    if (webhookSecret !== configuredSecret) {
      throw new BadRequestException('Webhook secret inválido');
    }

    const body = Array.isArray(rawBody) && rawBody[0]?.body
      ? rawBody[0].body
      : (rawBody as WebhookCheckoutDto);
    const event = body?.event ?? starfyEvent;
    if (event !== 'approved') {
      throw new BadRequestException('Evento não aprovado');
    }

    return this.webhookService.handleCheckoutApproved(body as any);
  }
}
