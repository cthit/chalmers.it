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

  console.log('Adding', type, language, webhook, 'as a notifier.');

  await NotifyService.addNotifier(type, language, webhook);
}

export async function removeNotifier(id: number) {
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  console.log('Removing notifier with id', id);

  await NotifyService.removeNotifier(id);
}
