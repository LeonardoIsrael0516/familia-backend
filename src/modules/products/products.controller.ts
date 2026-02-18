import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.productsService.findAll(userId);
  }

  @Get(':slug/full')
  findFullBySlug(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
  ) {
    return this.productsService.findFullBySlug(slug, userId);
  }

  @Get(':slug')
  findBySlug(
    @CurrentUser('id') userId: string,
    @Param('slug') slug: string,
  ) {
    return this.productsService.findBySlug(slug, userId);
  }
}
