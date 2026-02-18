import { Module } from '@nestjs/common';
import { PwaController } from './pwa.controller';
import { AdminPwaController } from './admin-pwa.controller';
import { PwaService } from './pwa.service';
import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  controllers: [PwaController, AdminPwaController],
  providers: [PwaService, AdminGuard],
  exports: [PwaService],
})
export class PwaModule {}
