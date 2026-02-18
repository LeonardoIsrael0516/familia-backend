"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PwaModule = void 0;
const common_1 = require("@nestjs/common");
const pwa_controller_1 = require("./pwa.controller");
const admin_pwa_controller_1 = require("./admin-pwa.controller");
const pwa_service_1 = require("./pwa.service");
const admin_guard_1 = require("../../common/guards/admin.guard");
let PwaModule = class PwaModule {
};
exports.PwaModule = PwaModule;
exports.PwaModule = PwaModule = __decorate([
    (0, common_1.Module)({
        controllers: [pwa_controller_1.PwaController, admin_pwa_controller_1.AdminPwaController],
        providers: [pwa_service_1.PwaService, admin_guard_1.AdminGuard],
        exports: [pwa_service_1.PwaService],
    })
], PwaModule);
//# sourceMappingURL=pwa.module.js.map