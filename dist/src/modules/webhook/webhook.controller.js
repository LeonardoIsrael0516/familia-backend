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
exports.WebhookController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const webhook_service_1 = require("./webhook.service");
const config_1 = require("@nestjs/config");
let WebhookController = class WebhookController {
    constructor(webhookService, config) {
        this.webhookService = webhookService;
        this.config = config;
    }
    async checkout(webhookSecret, starfyEvent, rawBody) {
        const configuredSecret = this.config.get('webhook.secret');
        if (!configuredSecret || configuredSecret.length < 16) {
            throw new common_1.BadRequestException('Webhook não configurado. Defina WEBHOOK_SECRET na .env (mín. 16 caracteres).');
        }
        if (webhookSecret !== configuredSecret) {
            throw new common_1.BadRequestException('Webhook secret inválido');
        }
        const body = Array.isArray(rawBody) && rawBody[0]?.body
            ? rawBody[0].body
            : rawBody;
        const event = body?.event ?? starfyEvent;
        if (event !== 'approved') {
            throw new common_1.BadRequestException('Evento não aprovado');
        }
        return this.webhookService.handleCheckoutApproved(body);
    }
};
exports.WebhookController = WebhookController;
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Headers)('x-webhook-secret')),
    __param(1, (0, common_1.Headers)('x-starfy-event')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WebhookController.prototype, "checkout", null);
exports.WebhookController = WebhookController = __decorate([
    (0, common_1.Controller)('webhook'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [webhook_service_1.WebhookService,
        config_1.ConfigService])
], WebhookController);
//# sourceMappingURL=webhook.controller.js.map