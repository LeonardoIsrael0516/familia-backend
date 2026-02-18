import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../common/guards/admin.guard';
import { EmailSettingsService } from './email-settings.service';
import { EmailService } from './email.service';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';

@Controller('admin/email-settings')
@UseGuards(AdminGuard)
export class AdminEmailSettingsController {
  constructor(
    private readonly emailSettingsService: EmailSettingsService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  getSettings() {
    return this.emailSettingsService.getConfigForAdmin();
  }

  @Patch()
  updateSettings(@Body() dto: UpdateEmailSettingsDto) {
    return this.emailSettingsService.updateSettings(dto);
  }

  @Post('test')
  async sendTest(@Body() body: { to?: string }) {
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
}
