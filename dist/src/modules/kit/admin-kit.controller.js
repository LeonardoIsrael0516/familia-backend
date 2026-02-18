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
exports.AdminKitController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const kit_service_1 = require("./kit.service");
const create_kit_section_dto_1 = require("./dto/create-kit-section.dto");
const update_kit_section_dto_1 = require("./dto/update-kit-section.dto");
let AdminKitController = class AdminKitController {
    constructor(kitService) {
        this.kitService = kitService;
    }
    findAll(productId) {
        return this.kitService.findAllByProductId(productId);
    }
    findOne(productId, sectionId) {
        return this.kitService.findOne(productId, sectionId);
    }
    create(productId, dto) {
        return this.kitService.create(productId, dto);
    }
    update(productId, sectionId, dto) {
        return this.kitService.update(productId, sectionId, dto);
    }
    remove(productId, sectionId) {
        return this.kitService.remove(productId, sectionId);
    }
};
exports.AdminKitController = AdminKitController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminKitController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':sectionId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminKitController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_kit_section_dto_1.CreateKitSectionDto]),
    __metadata("design:returntype", void 0)
], AdminKitController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':sectionId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('sectionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_kit_section_dto_1.UpdateKitSectionDto]),
    __metadata("design:returntype", void 0)
], AdminKitController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':sectionId'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('sectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdminKitController.prototype, "remove", null);
exports.AdminKitController = AdminKitController = __decorate([
    (0, common_1.Controller)('admin/products/:productId/kit-sections'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [kit_service_1.KitService])
], AdminKitController);
//# sourceMappingURL=admin-kit.controller.js.map