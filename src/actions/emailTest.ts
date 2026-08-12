'use server';

import EmailService from '@/services/emailService';
import SessionService from '@/services/sessionService';
import { Language } from '@prisma/client';

export async function sendTestEmail(email: string, locale: string) {
  if (!(await SessionService.isAdmin())) throw new Error('Unauthorized');

  const normalizedEmail = email.trim().toLowerCase();
  if (
    normalizedEmail.length > 320 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    throw new Error('Invalid email address');
  }

  await EmailService.sendTestEmail(
    normalizedEmail,
    locale === 'en' ? Language.EN : Language.SV
  );
}
