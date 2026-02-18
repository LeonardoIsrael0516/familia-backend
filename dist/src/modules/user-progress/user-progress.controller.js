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
exports.UserProgressController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_progress_service_1 = require("./user-progress.service");
const save_progress_dto_1 = require("./dto/save-progress.dto");
const save_planner_progress_dto_1 = require("./dto/save-planner-progress.dto");
let UserProgressController = class UserProgressController {
    constructor(userProgressService) {
        this.userProgressService = userProgressService;
    }
    getDevocionalProgress(userId, productId) {
        return this.userProgressService.getDevocionalProgress(userId, productId);
    }
    saveDevocionalProgress(userId, productId, dto) {
        return this.userProgressService.saveDevocionalProgress(userId, productId, dto);
    }
    getPlannerProgress(userId, productId) {
        return this.userProgressService.getPlannerProgress(userId, productId);
    }
    savePlannerProgress(userId, productId, dto) {
        return this.userProgressService.savePlannerProgress(userId, productId, dto);
    }
};
exports.UserProgressController = UserProgressController;
__decorate([
    (0, common_1.Get)('devocional/:productId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserProgressController.prototype, "getDevocionalProgress", null);
__decorate([
    (0, common_1.Post)('devocional/:productId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, save_progress_dto_1.SaveDevocionalProgressDto]),
    __metadata("design:returntype", void 0)
], UserProgressController.prototype, "saveDevocionalProgress", null);
__decorate([
    (0, common_1.Get)('kit/:productId/planner'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserProgressController.prototype, "getPlannerProgress", null);
__decorate([
    (0, common_1.Patch)('kit/:productId/planner'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, save_planner_progress_dto_1.SavePlannerProgressDto]),
    __metadata("design:returntype", void 0)
], UserProgressController.prototype, "savePlannerProgress", null);
exports.UserProgressController = UserProgressController = __decorate([
    (0, common_1.Controller)('user/progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_progress_service_1.UserProgressService])
], UserProgressController);
//# sourceMappingURL=user-progress.controller.js.map