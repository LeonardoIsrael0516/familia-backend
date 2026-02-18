import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PushService } from './push.service';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto';

@Controller('user/push-subscription')
@UseGuards(JwtAuthGuard)
export class PushSubscriptionController {
  constructor(private readonly pushService: PushService) {}

  @Post()
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePushSubscriptionDto,
    @Req() req: { headers?: { 'user-agent'?: string } },
  ) {
    const userAgent = req.headers?.['user-agent'];
    await this.pushService.saveSubscription(userId, dto, userAgent);
    return { ok: true };
  }
}
