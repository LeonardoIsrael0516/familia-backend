import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';

@Controller('ananindeua')
@Public()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('setup')
  @Throttle({ default: { limit: 3, ttl: 3600000 } })
  createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }
}
