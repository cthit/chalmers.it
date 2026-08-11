import emailEnglish from '@/dictionaries/email/en.json';
import emailSwedish from '@/dictionaries/email/sv.json';
import { Language } from '@prisma/client';
import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;
const smtpFrom = process.env.SMTP_FROM ?? smtpUser;

export default class EmailService {
  static async sendTestEmail(email: string, language: Language) {
    const copy = language === Language.EN ? emailEnglish : emailSwedish;
    const timestamp = new Date().toISOString();

    await this.getTransporter().sendMail({
      from: smtpFrom,
      to: email,
      subject: copy.test.subject,
      text: `${copy.test.heading}\n\n${copy.test.body}\n\n${copy.test.timestamp}: ${timestamp}`,
      html: `<!doctype html>
<html lang="${copy.locale}">
  <body style="margin:0;padding:24px;background:#f3f5f7;color:#17212b;font-family:Arial,sans-serif;">
    <main style="max-width:680px;margin:0 auto;padding:32px;background:#fff;border-top:5px solid #00a8d3;">
      <h1 style="margin-top:0;font-size:28px;line-height:1.2;">${copy.test.heading}</h1>
      <p style="font-size:16px;line-height:1.6;">${copy.test.body}</p>
      <p style="font-size:12px;color:#57606a;">${copy.test.timestamp}: ${timestamp}</p>
    </main>
  </body>
</html>`
    });
  }

  private static getTransporter() {
    if (!smtpHost || !smtpFrom) throw new Error('SMTP is not configured');

    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: process.env.SMTP_SECURE === 'true',
      requireTLS: process.env.SMTP_REQUIRE_TLS === 'true',
      auth:
        smtpUser && smtpPassword
          ? {
              user: smtpUser,
              pass: smtpPassword
            }
          : undefined
    });
  }
}
