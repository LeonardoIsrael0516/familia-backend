"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const admin_products_controller_1 = require("./admin-products.controller");
const admin_plans_controller_1 = require("./admin-plans.controller");
const admin_users_controller_1 = require("./admin-users.controller");
const admin_plans_service_1 = require("./admin-plans.service");
const admin_users_service_1 = require("./admin-users.service");
const admin_guard_1 = require("../../common/guards/admin.guard");
const users_module_1 = require("../users/users.module");
const products_module_1 = require("../products/products.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [users_module_1.UsersModule, products_module_1.ProductsModule],
        controllers: [
            admin_controller_1.AdminController,
            admin_products_controller_1.AdminProductsController,
            admin_plans_controller_1.AdminPlansController,
            admin_users_controller_1.AdminUsersController,
        ],
        providers: [admin_service_1.AdminService, admin_guard_1.AdminGuard, admin_plans_service_1.AdminPlansService, admin_users_service_1.AdminUsersService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map