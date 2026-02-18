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
import { CourseService } from './course.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';

@Controller('admin/products/:productId/course-modules')
@UseGuards(AdminGuard)
export class AdminCourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  findAllModules(@Param('productId') productId: string) {
    return this.courseService.findAllModulesByProductId(productId);
  }

  @Get(':moduleId')
  findOneModule(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.courseService.findOneModule(productId, moduleId);
  }

  @Post()
  createModule(
    @Param('productId') productId: string,
    @Body() dto: CreateCourseModuleDto,
  ) {
    return this.courseService.createModule(productId, dto);
  }

  @Patch(':moduleId')
  updateModule(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateCourseModuleDto,
  ) {
    return this.courseService.updateModule(productId, moduleId, dto);
  }

  @Delete(':moduleId')
  removeModule(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.courseService.removeModule(productId, moduleId);
  }

  @Get(':moduleId/lessons')
  findAllLessons(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.courseService.findAllLessons(productId, moduleId);
  }

  @Get(':moduleId/lessons/:lessonId')
  findOneLesson(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.courseService.findOneLesson(
      productId,
      moduleId,
      lessonId,
    );
  }

  @Post(':moduleId/lessons')
  createLesson(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateCourseLessonDto,
  ) {
    return this.courseService.createLesson(productId, moduleId, dto);
  }

  @Patch(':moduleId/lessons/:lessonId')
  updateLesson(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateCourseLessonDto,
  ) {
    return this.courseService.updateLesson(
      productId,
      moduleId,
      lessonId,
      dto,
    );
  }

  @Delete(':moduleId/lessons/:lessonId')
  removeLesson(
    @Param('productId') productId: string,
    @Param('moduleId') moduleId: string,
    @Param('lessonId') lessonId: string,
  ) {
    return this.courseService.removeLesson(productId, moduleId, lessonId);
  }
}
