import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ContentService } from './content.service';

@Controller('content')
@UseGuards(JwtAuthGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('product/:productId')
  findByProductId(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.contentService.findByProductId(productId, userId);
  }
}
