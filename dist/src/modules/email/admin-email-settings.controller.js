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
exports.AdminEmailSettingsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const email_settings_service_1 = require("./email-settings.service");
const email_service_1 = require("./email.service");
const update_email_settings_dto_1 = require("./dto/update-email-settings.dto");
let AdminEmailSettingsController = class AdminEmailSettingsController {
    constructor(emailSettingsService, emailService) {
        this.emailSettingsService = emailSettingsService;
        this.emailService = emailService;
    }
    getSettings() {
        return this.emailSettingsService.getConfigForAdmin();
    }
    updateSettings(dto) {
        return this.emailSettingsService.updateSettings(dto);
    }
    async sendTest(body) {
        const config = await this.emailSettingsService.getConfig();
        if (!config.host || !config.fromEmail) {
            return { ok: false, message: 'SMTP não configurado. Preencha host e e-mail de origem.' };
        }
        const to = (body?.to && body.to.trim()) || config.fromEmail;
        const sent = await this.emailService.sendMail({
            to,
            subject: 'Teste – Família em Conserva',
            html: '<p>Este é um e-mail de teste. Se você recebeu, o SMTP está funcionando.</p>',
            text: 'Este é um e-mail de teste. Se você recebeu, o SMTP está funcionando.',
        });
        return { ok: sent, message: sent ? 'E-mail de teste enviado.' : 'Falha ao enviar. Verifique as configurações SMTP.' };
    }
};
exports.AdminEmailSettingsController = AdminEmailSettingsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminEmailSettingsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_email_settings_dto_1.UpdateEmailSettingsDto]),
    __metadata("design:returntype", void 0)
], AdminEmailSettingsController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminEmailSettingsController.prototype, "sendTest", null);
exports.AdminEmailSettingsController = AdminEmailSettingsController = __decorate([
    (0, common_1.Controller)('admin/email-settings'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [email_settings_service_1.EmailSettingsService,
        email_service_1.EmailService])
], AdminEmailSettingsController);
//# sourceMappingURL=admin-email-settings.controller.js.map