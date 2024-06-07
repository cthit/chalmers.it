'use server';

import NotifyService from '@/services/notifyService';
import { Language, NotifierType } from '@prisma/client';
import SessionService from '@/services/sessionService';

export async function addNotifier(
  type: NotifierType,
  language: Language,
  webhook: string
) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  await NotifyService.addNotifier(type, language, webhook);
}
