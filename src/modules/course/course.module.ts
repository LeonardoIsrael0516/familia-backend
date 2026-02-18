import { Module } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { CourseService } from './course.service';
import { AdminCourseController } from './admin-course.controller';

@Module({
  controllers: [AdminCourseController],
  providers: [CourseService, AdminGuard],
  exports: [CourseService],
})
export class CourseModule {}
