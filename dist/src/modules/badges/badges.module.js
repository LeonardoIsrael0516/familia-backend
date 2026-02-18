"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgesModule = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const badges_service_1 = require("./badges.service");
const admin_badges_controller_1 = require("./admin-badges.controller");
let BadgesModule = class BadgesModule {
};
exports.BadgesModule = BadgesModule;
exports.BadgesModule = BadgesModule = __decorate([
    (0, common_1.Module)({
        controllers: [admin_badges_controller_1.AdminBadgesController],
        providers: [badges_service_1.BadgesService, admin_guard_1.AdminGuard],
        exports: [badges_service_1.BadgesService],
    })
], BadgesModule);
//# sourceMappingURL=badges.module.js.map