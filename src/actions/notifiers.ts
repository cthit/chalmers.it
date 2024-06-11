'use server';

import NotifyService from '@/services/notifyService';
import { Language, NotifierType } from '@prisma/client';
import SessionService from '@/services/sessionService';
import { redirect } from 'next/navigation';

export async function addNotifier(
  type: NotifierType,
  language: Language,
  webhook: string
) {
  console.log('Adding', type, language, webhook, 'as a notifier.');
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  console.log('Adding', type, language, webhook, 'as a notifier.');

  await NotifyService.addNotifier(type, language, webhook);
  redirect('/settings/notifiers');
}

export async function removeNotifier(id: number) {
  console.log('Removing notifier with id', id);
  if (!(await SessionService.isAdmin())) {
    throw new Error('Unauthorized');
  }

  console.log('Removing notifier with id', id);

  await NotifyService.removeNotifier(id);
  redirect('/settings/notifiers');
}
