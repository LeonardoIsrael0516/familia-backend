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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const email_settings_service_1 = require("./email-settings.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(emailSettings) {
        this.emailSettings = emailSettings;
        this.transporter = null;
        this.lastConfigHash = '';
    }
    async getTransporter() {
        const config = await this.emailSettings.getConfig();
        const hash = JSON.stringify({
            host: config.host,
            port: config.port,
            secure: config.secure,
            user: config.user,
        });
        if (!config.host || !config.fromEmail)
            return null;
        if (this.transporter && this.lastConfigHash === hash)
            return this.transporter;
        this.transporter = nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: config.secure,
            auth: config.user && config.password ? { user: config.user, pass: config.password } : undefined,
        });
        this.lastConfigHash = hash;
        return this.transporter;
    }
    async sendMail(options) {
        const transport = await this.getTransporter();
        if (!transport)
            return false;
        const config = await this.emailSettings.getConfig();
        try {
            await transport.sendMail({
                from: `"${config.fromName}" <${config.fromEmail}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
            });
            return true;
        }
        catch {
            return false;
        }
    }
    static htmlWrapper(title, body) {
        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5; color: #333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 24px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
          <tr>
            <td style="padding: 32px 28px;">
              ${body}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    }
    async sendWelcomeWithAccess(email, name, password, frontendUrl) {
        const loginUrl = frontendUrl.replace(/\/$/, '') + '/';
        const body = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 24px; color: #3d4a2a;">Bem-vindo(a) à Família em Conserva!</h1>
      </div>
      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">Olá, <strong>${escapeHtml(name)}</strong>!</p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Sua compra foi confirmada e sua conta já está ativa. Use os dados abaixo para acessar a plataforma:</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
        <tr><td style="padding: 16px 20px;">
          <p style="margin: 0 0 8px; font-size: 14px; color: #666;">Seu e-mail (login):</p>
          <p style="margin: 0; font-size: 16px; font-weight: 600;">${escapeHtml(email)}</p>
          <p style="margin: 12px 0 0; font-size: 14px; color: #666;">Sua senha:</p>
          <p style="margin: 4px 0 0; font-size: 16px; font-weight: 600;">${escapeHtml(password)}</p>
        </td></tr>
      </table>
      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">Recomendamos que você troque sua senha no primeiro acesso em configurações da conta.</p>
      <p style="margin: 0 0 24px; text-align: center;">
        <a href="${escapeHtml(loginUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #3d4a2a; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">Acessar a plataforma</a>
      </p>
      <p style="margin: 0; font-size: 14px; color: #666;">Qualquer dúvida, estamos à disposição.</p>
      <p style="margin: 16px 0 0; font-size: 14px; color: #666;">— Equipe Família em Conserva</p>
    `;
        const html = EmailService_1.htmlWrapper('Bem-vindo à Família em Conserva', body);
        const text = `Olá, ${name}! Sua conta foi criada. Acesse: ${loginUrl} - Login: ${email} - Senha: ${password}. Recomendamos trocar a senha no primeiro acesso.`;
        return this.sendMail({ to: email, subject: 'Bem-vindo à Família em Conserva – seus dados de acesso', html, text });
    }
    async sendSubscriptionActivated(email, name, frontendUrl) {
        const loginUrl = frontendUrl.replace(/\/$/, '') + '/';
        const body = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 24px; color: #3d4a2a;">Sua assinatura foi ativada</h1>
      </div>
      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">Olá, <strong>${escapeHtml(name)}</strong>!</p>
      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.5;">Uma nova assinatura foi vinculada à sua conta. Você já pode acessar todo o conteúdo do plano.</p>
      <p style="margin: 0 0 24px; text-align: center;">
        <a href="${escapeHtml(loginUrl)}" style="display: inline-block; padding: 14px 28px; background-color: #3d4a2a; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">Acessar a plataforma</a>
      </p>
      <p style="margin: 0; font-size: 14px; color: #666;">— Equipe Família em Conserva</p>
    `;
        const html = EmailService_1.htmlWrapper('Assinatura ativada – Família em Conserva', body);
        const text = `Olá, ${name}! Sua assinatura foi ativada. Acesse: ${loginUrl}`;
        return this.sendMail({ to: email, subject: 'Assinatura ativada – Família em Conserva', html, text });
    }
    async sendPasswordReset(email, resetLink) {
        const body = `
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 24px; color: #3d4a2a;">Redefinir senha</h1>
      </div>
      <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">Você solicitou a redefinição de senha da sua conta Família em Conserva.</p>
      <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5;">Clique no botão abaixo para definir uma nova senha. O link expira em 1 hora.</p>
      <p style="margin: 0 0 24px; text-align: center;">
        <a href="${escapeHtml(resetLink)}" style="display: inline-block; padding: 14px 28px; background-color: #3d4a2a; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">Redefinir senha</a>
      </p>
      <p style="margin: 0; font-size: 14px; color: #666;">Se você não solicitou isso, ignore este e-mail. Sua senha não será alterada.</p>
      <p style="margin: 16px 0 0; font-size: 14px; color: #666;">— Equipe Família em Conserva</p>
    `;
        const html = EmailService_1.htmlWrapper('Redefinir senha – Família em Conserva', body);
        const text = `Redefinir senha: ${resetLink}. O link expira em 1 hora. Se não solicitou, ignore.`;
        return this.sendMail({ to: email, subject: 'Redefinir senha – Família em Conserva', html, text });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_settings_service_1.EmailSettingsService])
], EmailService);
function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
//# sourceMappingURL=email.service.js.map