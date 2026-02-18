import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AddSubscriptionDto } from './dto/add-subscription.dto';

@Controller('admin/users')
@UseGuards(AdminGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('subscribersOnly') subscribersOnly?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.adminUsersService.findAll({
      search: search || undefined,
      subscribersOnly: subscribersOnly === 'true',
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.adminUsersService.createUser(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminUsersService.findById(id);
  }

  @Patch(':id/password')
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.adminUsersService.changePassword(id, dto.newPassword);
  }

  @Post(':id/subscriptions')
  addSubscription(@Param('id') id: string, @Body() dto: AddSubscriptionDto) {
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    return this.adminUsersService.addSubscription(id, dto.planId, dto.periodType, expiresAt);
  }
}
