import { Module } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { BadgesService } from './badges.service';
import { AdminBadgesController } from './admin-badges.controller';

@Module({
  controllers: [AdminBadgesController],
  providers: [BadgesService, AdminGuard],
  exports: [BadgesService],
})
export class BadgesModule {}
