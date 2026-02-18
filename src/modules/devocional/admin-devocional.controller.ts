import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { DevocionalService } from './devocional.service';
import { CreateDevocionalDayDto } from './dto/create-devocional-day.dto';
import { UpdateDevocionalDayDto } from './dto/update-devocional-day.dto';

@Controller('admin/products/:productId/devocional-days')
@UseGuards(AdminGuard)
export class AdminDevocionalController {
  constructor(private readonly devocionalService: DevocionalService) {}

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.devocionalService.findAllByProductId(productId);
  }

  @Get(':dayId')
  findOne(
    @Param('productId') productId: string,
    @Param('dayId') dayId: string,
  ) {
    return this.devocionalService.findOne(productId, dayId);
  }

  @Post()
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateDevocionalDayDto,
  ) {
    return this.devocionalService.create(productId, dto);
  }

  @Patch(':dayId')
  update(
    @Param('productId') productId: string,
    @Param('dayId') dayId: string,
    @Body() dto: UpdateDevocionalDayDto,
  ) {
    return this.devocionalService.update(productId, dayId, dto);
  }

  @Delete(':dayId')
  remove(
    @Param('productId') productId: string,
    @Param('dayId') dayId: string,
  ) {
    return this.devocionalService.remove(productId, dayId);
  }
}
