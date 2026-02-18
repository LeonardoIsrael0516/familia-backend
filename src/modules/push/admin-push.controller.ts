import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { PushService } from './push.service';
import { SendPushDto } from './dto/send-push.dto';

@Controller('admin/push')
@UseGuards(AdminGuard)
export class AdminPushController {
  constructor(private readonly pushService: PushService) {}

  @Post('send')
  async sendToAll(@Body() dto: SendPushDto) {
    const result = await this.pushService.sendToAll({
      title: dto.title,
      body: dto.body,
      url: dto.url,
    });
    return result;
  }
}
