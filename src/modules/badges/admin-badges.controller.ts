import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';

@Controller('admin/badges')
@UseGuards(AdminGuard)
export class AdminBadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  @Get()
  findAll(@Query('productId') productId?: string) {
    return this.badgesService.findAll(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.badgesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateBadgeDto) {
    return this.badgesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBadgeDto) {
    return this.badgesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.badgesService.remove(id);
  }
}
