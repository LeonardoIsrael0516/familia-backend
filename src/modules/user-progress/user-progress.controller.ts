import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserProgressService } from './user-progress.service';
import { SaveDevocionalProgressDto } from './dto/save-progress.dto';
import { SavePlannerProgressDto } from './dto/save-planner-progress.dto';

@Controller('user/progress')
@UseGuards(JwtAuthGuard)
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Get('devocional/:productId')
  getDevocionalProgress(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userProgressService.getDevocionalProgress(userId, productId);
  }

  @Post('devocional/:productId')
  saveDevocionalProgress(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: SaveDevocionalProgressDto,
  ) {
    return this.userProgressService.saveDevocionalProgress(
      userId,
      productId,
      dto,
    );
  }

  @Get('kit/:productId/planner')
  getPlannerProgress(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.userProgressService.getPlannerProgress(userId, productId);
  }

  @Patch('kit/:productId/planner')
  savePlannerProgress(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: SavePlannerProgressDto,
  ) {
    return this.userProgressService.savePlannerProgress(userId, productId, dto);
  }
}
