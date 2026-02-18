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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PwaController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const pwa_service_1 = require("./pwa.service");
const config_1 = require("@nestjs/config");
let PwaController = class PwaController {
    constructor(pwaService, config) {
        this.pwaService = pwaService;
        this.config = config;
    }
    getConfig() {
        return this.pwaService.getConfig();
    }
    async getManifest() {
        const origin = this.config.get('cors.origin') || '';
        return this.pwaService.getManifest(origin);
    }
};
exports.PwaController = PwaController;
__decorate([
    (0, common_1.Get)('config'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PwaController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)('manifest'),
    (0, common_1.Header)('Content-Type', 'application/manifest+json'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PwaController.prototype, "getManifest", null);
exports.PwaController = PwaController = __decorate([
    (0, common_1.Controller)('pwa'),
    (0, public_decorator_1.Public)(),
    __metadata("design:paramtypes", [pwa_service_1.PwaService,
        config_1.ConfigService])
], PwaController);
//# sourceMappingURL=pwa.controller.js.map