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
exports.AdminPushController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const push_service_1 = require("./push.service");
const send_push_dto_1 = require("./dto/send-push.dto");
let AdminPushController = class AdminPushController {
    constructor(pushService) {
        this.pushService = pushService;
    }
    async sendToAll(dto) {
        const result = await this.pushService.sendToAll({
            title: dto.title,
            body: dto.body,
            url: dto.url,
        });
        return result;
    }
};
exports.AdminPushController = AdminPushController;
__decorate([
    (0, common_1.Post)('send'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_push_dto_1.SendPushDto]),
    __metadata("design:returntype", Promise)
], AdminPushController.prototype, "sendToAll", null);
exports.AdminPushController = AdminPushController = __decorate([
    (0, common_1.Controller)('admin/push'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [push_service_1.PushService])
], AdminPushController);
//# sourceMappingURL=admin-push.controller.js.map