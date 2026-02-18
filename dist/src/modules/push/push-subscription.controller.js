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
exports.PushSubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const push_service_1 = require("./push.service");
const create_push_subscription_dto_1 = require("./dto/create-push-subscription.dto");
let PushSubscriptionController = class PushSubscriptionController {
    constructor(pushService) {
        this.pushService = pushService;
    }
    async create(userId, dto, req) {
        const userAgent = req.headers?.['user-agent'];
        await this.pushService.saveSubscription(userId, dto, userAgent);
        return { ok: true };
    }
};
exports.PushSubscriptionController = PushSubscriptionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_push_subscription_dto_1.CreatePushSubscriptionDto, Object]),
    __metadata("design:returntype", Promise)
], PushSubscriptionController.prototype, "create", null);
exports.PushSubscriptionController = PushSubscriptionController = __decorate([
    (0, common_1.Controller)('user/push-subscription'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [push_service_1.PushService])
], PushSubscriptionController);
//# sourceMappingURL=push-subscription.controller.js.map