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
exports.AdminDevocionalController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const devocional_service_1 = require("./devocional.service");
const create_devocional_day_dto_1 = require("./dto/create-devocional-day.dto");
const update_devocional_day_dto_1 = require("./dto/update-devocional-day.dto");
let AdminDevocionalController = class AdminDevocionalController {
    constructor(devocionalService) {
        this.devocionalService = devocionalService;
    }
    findAll(productId) {
        return this.devocionalService.findAllByProductId(productId);
    }
    findOne(productId, dayId) {
        return this.devocionalService.findOne(productId, dayId);
    }
    create(productId, dto) {
        return this.devocionalService.create(productId, dto);
    }
    update(productId, dayId, dto) {
        return this.devocionalService.update(productId, dayId, dto);
    }
    remove(productId, dayId) {
        return this.devocionalService.remove(productId, dayId);
    }
};
exports.AdminDevocionalController = AdminDevocionalController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminDevocionalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':dayId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('dayId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminDevocionalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_devocional_day_dto_1.CreateDevocionalDayDto]),
    __metadata("design:returntype", void 0)
], AdminDevocionalController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':dayId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('dayId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_devocional_day_dto_1.UpdateDevocionalDayDto]),
    __metadata("design:returntype", void 0)
], AdminDevocionalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':dayId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('dayId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminDevocionalController.prototype, "remove", null);
exports.AdminDevocionalController = AdminDevocionalController = __decorate([
    (0, common_1.Controller)('admin/products/:productId/devocional-days'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [devocional_service_1.DevocionalService])
], AdminDevocionalController);
//# sourceMappingURL=admin-devocional.controller.js.map