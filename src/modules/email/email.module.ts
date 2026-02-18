import { Module } from '@nestjs/common';
import { EmailSettingsService } from './email-settings.service';
import { EmailService } from './email.service';
import { AdminEmailSettingsController } from './admin-email-settings.controller';
import { AdminGuard } from '../../common/guards/admin.guard';

@Module({
  controllers: [AdminEmailSettingsController],
  providers: [EmailSettingsService, EmailService, AdminGuard],
  exports: [EmailService],
})
export class EmailModule {}
