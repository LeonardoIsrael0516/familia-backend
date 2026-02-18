import { CourseService } from './course.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import { UpdateCourseModuleDto } from './dto/update-course-module.dto';
import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';
export declare class AdminCourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    findAllModules(productId: string): Promise<({
        lessons: {
            id: string;
            title: string;
            sortOrder: number;
            createdAt: Date;
            videoUrl: string | null;
            summary: string | null;
            practicalQuestion: string | null;
            durationMinutes: number | null;
            moduleId: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        productId: string;
    })[]>;
    findOneModule(productId: string, moduleId: string): Promise<({
        lessons: {
            id: string;
            title: string;
            sortOrder: number;
            createdAt: Date;
            videoUrl: string | null;
            summary: string | null;
            practicalQuestion: string | null;
            durationMinutes: number | null;
            moduleId: string;
        }[];
    } & {
        id: string;
        title: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        productId: string;
    }) | null>;
    createModule(productId: string, dto: CreateCourseModuleDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        productId: string;
    }>;
    updateModule(productId: string, moduleId: string, dto: UpdateCourseModuleDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        sortOrder: number;
        createdAt: Date;
        productId: string;
    }>;
    removeModule(productId: string, moduleId: string): Promise<void>;
    findAllLessons(productId: string, moduleId: string): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        videoUrl: string | null;
        summary: string | null;
        practicalQuestion: string | null;
        durationMinutes: number | null;
        moduleId: string;
    }[]>;
    findOneLesson(productId: string, moduleId: string, lessonId: string): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        videoUrl: string | null;
        summary: string | null;
        practicalQuestion: string | null;
        durationMinutes: number | null;
        moduleId: string;
    }>;
    createLesson(productId: string, moduleId: string, dto: CreateCourseLessonDto): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        videoUrl: string | null;
        summary: string | null;
        practicalQuestion: string | null;
        durationMinutes: number | null;
        moduleId: string;
    }>;
    updateLesson(productId: string, moduleId: string, lessonId: string, dto: UpdateCourseLessonDto): Promise<{
        id: string;
        title: string;
        sortOrder: number;
        createdAt: Date;
        videoUrl: string | null;
        summary: string | null;
        practicalQuestion: string | null;
        durationMinutes: number | null;
        moduleId: string;
    }>;
    removeLesson(productId: string, moduleId: string, lessonId: string): Promise<void>;
}
