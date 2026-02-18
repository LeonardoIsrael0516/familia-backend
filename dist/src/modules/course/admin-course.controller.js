"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCourseController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const course_service_1 = require("./course.service");
const create_course_module_dto_1 = require("./dto/create-course-module.dto");
const update_course_module_dto_1 = require("./dto/update-course-module.dto");
const create_course_lesson_dto_1 = require("./dto/create-course-lesson.dto");
const update_course_lesson_dto_1 = require("./dto/update-course-lesson.dto");
let AdminCourseController = class AdminCourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    findAllModules(productId) {
        return this.courseService.findAllModulesByProductId(productId);
    }
    findOneModule(productId, moduleId) {
        return this.courseService.findOneModule(productId, moduleId);
    }
    createModule(productId, dto) {
        return this.courseService.createModule(productId, dto);
    }
    updateModule(productId, moduleId, dto) {
        return this.courseService.updateModule(productId, moduleId, dto);
    }
    removeModule(productId, moduleId) {
        return this.courseService.removeModule(productId, moduleId);
    }
    findAllLessons(productId, moduleId) {
        return this.courseService.findAllLessons(productId, moduleId);
    }
    findOneLesson(productId, moduleId, lessonId) {
        return this.courseService.findOneLesson(productId, moduleId, lessonId);
    }
    createLesson(productId, moduleId, dto) {
        return this.courseService.createLesson(productId, moduleId, dto);
    }
    updateLesson(productId, moduleId, lessonId, dto) {
        return this.courseService.updateLesson(productId, moduleId, lessonId, dto);
    }
    removeLesson(productId, moduleId, lessonId) {
        return this.courseService.removeLesson(productId, moduleId, lessonId);
    }
};
exports.AdminCourseController = AdminCourseController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "findAllModules", null);
__decorate([
    (0, common_1.Get)(':moduleId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "findOneModule", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_course_module_dto_1.CreateCourseModuleDto]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "createModule", null);
__decorate([
    (0, common_1.Patch)(':moduleId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_course_module_dto_1.UpdateCourseModuleDto]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "updateModule", null);
__decorate([
    (0, common_1.Delete)(':moduleId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "removeModule", null);
__decorate([
    (0, common_1.Get)(':moduleId/lessons'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "findAllLessons", null);
__decorate([
    (0, common_1.Get)(':moduleId/lessons/:lessonId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "findOneLesson", null);
__decorate([
    (0, common_1.Post)(':moduleId/lessons'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_course_lesson_dto_1.CreateCourseLessonDto]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "createLesson", null);
__decorate([
    (0, common_1.Patch)(':moduleId/lessons/:lessonId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('lessonId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, update_course_lesson_dto_1.UpdateCourseLessonDto]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "updateLesson", null);
__decorate([
    (0, common_1.Delete)(':moduleId/lessons/:lessonId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('moduleId')),
    __param(2, (0, common_1.Param)('lessonId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminCourseController.prototype, "removeLesson", null);
exports.AdminCourseController = AdminCourseController = __decorate([
    (0, common_1.Controller)('admin/products/:productId/course-modules'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], AdminCourseController);
//# sourceMappingURL=admin-course.controller.js.map