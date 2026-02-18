import { Module } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { KitService } from './kit.service';
import { AdminKitController } from './admin-kit.controller';

@Module({
  controllers: [AdminKitController],
  providers: [KitService, AdminGuard],
  exports: [KitService],
})
export class KitModule {}
