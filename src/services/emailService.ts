import emailEnglish from '@/dictionaries/email/en.json';
import emailSwedish from '@/dictionaries/email/sv.json';
import { Language } from '@prisma/client';
import GotifyService from './gotifyService';

const emailFrom = process.env.EMAIL_FROM;

export default class EmailService {
  static async sendTestEmail(email: string, language: Language) {
    const copy = language === Language.EN ? emailEnglish : emailSwedish;
    const timestamp = new Date().toISOString();

    if (!emailFrom) throw new Error('Email sender is not configured');

    await GotifyService.sendMessage(
      email,
      emailFrom,
      copy.test.subject,
      `${copy.test.heading}\n\n${copy.test.body}\n\n${copy.test.timestamp}: ${timestamp}`
    );
  }
}
