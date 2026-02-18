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
import { KitService } from './kit.service';
import { CreateKitSectionDto } from './dto/create-kit-section.dto';
import { UpdateKitSectionDto } from './dto/update-kit-section.dto';

@Controller('admin/products/:productId/kit-sections')
@UseGuards(AdminGuard)
export class AdminKitController {
  constructor(private readonly kitService: KitService) {}

  @Get()
  findAll(@Param('productId') productId: string) {
    return this.kitService.findAllByProductId(productId);
  }

  @Get(':sectionId')
  findOne(
    @Param('productId') productId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.kitService.findOne(productId, sectionId);
  }

  @Post()
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateKitSectionDto,
  ) {
    return this.kitService.create(productId, dto);
  }

  @Patch(':sectionId')
  update(
    @Param('productId') productId: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateKitSectionDto,
  ) {
    return this.kitService.update(productId, sectionId, dto);
  }

  @Delete(':sectionId')
  remove(
    @Param('productId') productId: string,
    @Param('sectionId') sectionId: string,
  ) {
    return this.kitService.remove(productId, sectionId);
  }
}
