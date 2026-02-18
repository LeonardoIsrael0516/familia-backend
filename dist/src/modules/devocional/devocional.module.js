"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevocionalModule = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const devocional_service_1 = require("./devocional.service");
const admin_devocional_controller_1 = require("./admin-devocional.controller");
let DevocionalModule = class DevocionalModule {
};
exports.DevocionalModule = DevocionalModule;
exports.DevocionalModule = DevocionalModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_devocional_controller_1.AdminDevocionalController],
        providers: [devocional_service_1.DevocionalService, admin_guard_1.AdminGuard],
        exports: [devocional_service_1.DevocionalService],
    })
], DevocionalModule);
//# sourceMappingURL=devocional.module.js.map