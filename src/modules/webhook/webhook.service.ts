import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { PeriodType } from '@prisma/client';

const DEFAULT_PASSWORD = '123456';

const PERIOD_DAYS: Record<PeriodType, number> = {
  monthly: 30,
  semiannual: 180,
  annual: 365,
};

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
  ) {}

  async handleCheckoutApproved(body: {
    event: string;
    produto_id?: string;
    data: {
      transacao_id: string;
      comprador: { email: string; nome: string };
      produtos_comprados?: Array<{ produto_id: string }>;
    };
  }) {
    if (body.event !== 'approved') {
      throw new BadRequestException('Evento não é "approved"');
    }

    const produtoId =
      body.produto_id ??
      body.data?.produtos_comprados?.[0]?.produto_id;
    if (!produtoId || typeof produtoId !== 'string') {
      throw new BadRequestException('produto_id não encontrado no payload');
    }

    const comprador = body.data?.comprador;
    if (!comprador?.email || !comprador?.nome) {
      throw new BadRequestException('comprador.email e comprador.nome são obrigatórios');
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
      throw new BadRequestException(`Produto ID "${produtoId}" não mapeado a nenhum plano`);
    }

    let periodType: PeriodType;
    if (plan.externalProductIdMonthly === produtoId) {
      periodType = PeriodType.monthly;
    } else if (plan.externalProductIdSemiannual === produtoId) {
      periodType = PeriodType.semiannual;
    } else if (plan.externalProductIdAnnual === produtoId) {
      periodType = PeriodType.annual;
    } else {
      throw new BadRequestException('Plano encontrado mas período não identificado');
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

    const frontendUrl = this.config.get<string>('app.frontendUrl') || '';
    try {
      if (created) {
        await this.emailService.sendWelcomeWithAccess(
          user.email,
          user.name,
          DEFAULT_PASSWORD,
          frontendUrl,
        );
      } else {
        await this.emailService.sendSubscriptionActivated(
          user.email,
          user.name,
          frontendUrl,
        );
      }
    } catch {
      // do not fail webhook if email fails
    }

    return {
      ok: true,
      userId: user.id,
      subscriptionId: subscription.id,
    };
  }
}
