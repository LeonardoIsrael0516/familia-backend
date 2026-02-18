import { Module } from '@nestjs/common';
import { PushSubscriptionController } from './push-subscription.controller';
import { AdminPushController } from './admin-push.controller';
import { PushService } from './push.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  controllers: [PushSubscriptionController, AdminPushController],
  providers: [PushService, AdminGuard],
  exports: [PushService],
})
export class PushModule {}
