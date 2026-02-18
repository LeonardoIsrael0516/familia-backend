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
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/database/prisma.service");
const webPush = require("web-push");
let PushService = class PushService {
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
        this.initialized = false;
        const publicKey = this.config.get('vapid.publicKey');
        const privateKey = this.config.get('vapid.privateKey');
        if (publicKey && privateKey) {
            webPush.setVapidDetails('mailto:support@familiaemconserva.com', publicKey, privateKey);
            this.initialized = true;
        }
    }
    get pushSubscription() {
        return this.prisma.pushSubscription;
    }
    async saveSubscription(userId, dto, userAgent) {
        await this.pushSubscription.upsert({
            where: {
                userId_endpoint: {
                    userId,
                    endpoint: dto.endpoint,
                },
            },
            create: {
                userId,
                endpoint: dto.endpoint,
                p256dh: dto.keys.p256dh,
                auth: dto.keys.auth,
                userAgent: userAgent || null,
            },
            update: {
                p256dh: dto.keys.p256dh,
                auth: dto.keys.auth,
                userAgent: userAgent || null,
            },
        });
    }
    async sendToSubscription(subscription, payload) {
        if (!this.initialized)
            return false;
        try {
            await webPush.sendNotification({
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth,
                },
            }, payload, { TTL: 86400 });
            return true;
        }
        catch {
            return false;
        }
    }
    async sendToUser(userId, payload) {
        const subscriptions = await this.pushSubscription.findMany({
            where: { userId },
        });
        const payloadStr = JSON.stringify(payload);
        let sent = 0;
        for (const sub of subscriptions) {
            const ok = await this.sendToSubscription({ endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth }, payloadStr);
            if (ok)
                sent++;
        }
        return sent;
    }
    async sendToAll(payload) {
        if (!this.initialized) {
            throw new common_1.ServiceUnavailableException('Push não configurado. Defina VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY na .env.');
        }
        const subscriptions = await this.pushSubscription.findMany();
        const payloadStr = JSON.stringify(payload);
        let sent = 0;
        for (const sub of subscriptions) {
            const ok = await this.sendToSubscription({ endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth }, payloadStr);
            if (ok)
                sent++;
        }
        return { sent, total: subscriptions.length };
    }
};
exports.PushService = PushService;
exports.PushService = PushService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PushService);
//# sourceMappingURL=push.service.js.map