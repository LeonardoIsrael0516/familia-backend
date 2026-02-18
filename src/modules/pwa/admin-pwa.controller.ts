import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { PwaService } from './pwa.service';
import { UpdatePwaSettingsDto } from './dto/update-pwa-settings.dto';

@Controller('admin/pwa-settings')
@UseGuards(AdminGuard)
export class AdminPwaController {
  constructor(private readonly pwaService: PwaService) {}

  @Get()
  getSettings() {
    return this.pwaService.getAdminSettings();
  }

  @Patch()
  updateSettings(@Body() dto: UpdatePwaSettingsDto) {
    return this.pwaService.updateSettings(dto);
  }
}
