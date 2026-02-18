import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/database/prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
export declare class WebhookService {
    private readonly prisma;
    private readonly usersService;
    private readonly emailService;
    private readonly config;
    constructor(prisma: PrismaService, usersService: UsersService, emailService: EmailService, config: ConfigService);
    handleCheckoutApproved(body: {
        event: string;
        produto_id?: string;
        data: {
            transacao_id: string;
            comprador: {
                email: string;
                nome: string;
            };
            produtos_comprados?: Array<{
                produto_id: string;
            }>;
        };
    }): Promise<{
        ok: boolean;
        userId: string;
        subscriptionId: string;
        message: string;
    } | {
        ok: boolean;
        userId: string;
        subscriptionId: string;
        message?: undefined;
    }>;
}
