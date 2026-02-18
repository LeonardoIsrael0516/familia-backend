import { Module } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { DevocionalService } from './devocional.service';
import { AdminDevocionalController } from './admin-devocional.controller';

@Module({
  controllers: [AdminDevocionalController],
  providers: [DevocionalService, AdminGuard],
  exports: [DevocionalService],
})
export class DevocionalModule {}
