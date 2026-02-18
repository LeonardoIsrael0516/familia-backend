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
exports.WebhookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../common/database/prisma.service");
const users_service_1 = require("../users/users.service");
const email_service_1 = require("../email/email.service");
const client_1 = require("@prisma/client");
const DEFAULT_PASSWORD = '123456';
const PERIOD_DAYS = {
    monthly: 30,
    semiannual: 180,
    annual: 365,
};
let WebhookService = class WebhookService {
    constructor(prisma, usersService, emailService, config) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.emailService = emailService;
        this.config = config;
    }
    async handleCheckoutApproved(body) {
        if (body.event !== 'approved') {
            throw new common_1.BadRequestException('Evento não é "approved"');
        }
        const produtoId = body.produto_id ??
            body.data?.produtos_comprados?.[0]?.produto_id;
        if (!produtoId || typeof produtoId !== 'string') {
            throw new common_1.BadRequestException('produto_id não encontrado no payload');
        }
        const comprador = body.data?.comprador;
        if (!comprador?.email || !comprador?.nome) {
            throw new common_1.BadRequestException('comprador.email e comprador.nome são obrigatórios');
        }
        const plan = await this.prisma.plan.findFirst({
            where: {
                OR: [
                    { externalProductIdMonthly: produtoId },
                    { externalProductIdSemiannual: produtoId },
                    { externalProductIdAnnual: produtoId },
                ],
            },
        });
        if (!plan) {
            throw new common_1.BadRequestException(`Produto ID "${produtoId}" não mapeado a nenhum plano`);
        }
        let periodType;
        if (plan.externalProductIdMonthly === produtoId) {
            periodType = client_1.PeriodType.monthly;
        }
        else if (plan.externalProductIdSemiannual === produtoId) {
            periodType = client_1.PeriodType.semiannual;
        }
        else if (plan.externalProductIdAnnual === produtoId) {
            periodType = client_1.PeriodType.annual;
        }
        else {
            throw new common_1.BadRequestException('Plano encontrado mas período não identificado');
        }
        const transacaoId = body.data?.transacao_id ?? null;
        if (transacaoId) {
            const existing = await this.prisma.subscription.findFirst({
                where: { externalTransactionId: transacaoId },
            });
            if (existing) {
                return {
                    ok: true,
                    userId: existing.userId,
                    subscriptionId: existing.id,
                    message: 'Assinatura já processada (idempotência)',
                };
            }
        }
        const { user, created } = await this.usersService.findOrCreateByEmail({
            email: comprador.email.trim(),
            name: comprador.nome.trim(),
            password: DEFAULT_PASSWORD,
            role: 'user',
        });
        const startsAt = new Date();
        const days = PERIOD_DAYS[periodType];
        const expiresAt = new Date(startsAt);
        expiresAt.setDate(expiresAt.getDate() + days);
        const subscription = await this.prisma.subscription.create({
            data: {
                userId: user.id,
                planId: plan.id,
                periodType,
                status: 'active',
                startsAt,
                expiresAt,
                externalTransactionId: transacaoId,
            },
        });
        const frontendUrl = this.config.get('app.frontendUrl') || '';
        try {
            if (created) {
                await this.emailService.sendWelcomeWithAccess(user.email, user.name, DEFAULT_PASSWORD, frontendUrl);
            }
            else {
                await this.emailService.sendSubscriptionActivated(user.email, user.name, frontendUrl);
            }
        }
        catch {
        }
        return {
            ok: true,
            userId: user.id,
            subscriptionId: subscription.id,
        };
    }
};
exports.WebhookService = WebhookService;
exports.WebhookService = WebhookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService,
        email_service_1.EmailService,
        config_1.ConfigService])
], WebhookService);
//# sourceMappingURL=webhook.service.js.map