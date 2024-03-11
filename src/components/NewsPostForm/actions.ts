'use server';

import NewsService from '@/services/newsService';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { PostStatus } from '@prisma/client';

export async function post(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  scheduledPublish?: Date
) {
  const session = await getServerSession(authConfig);
  await NewsService.post({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    scheduledPublish,
    writtenByGammaUserId: session?.user?.id!,
    status: scheduledPublish ? PostStatus.SCHEDULED : PostStatus.PUBLISHED
  });
  redirect('/');
}

export async function edit(
  id: number,
  writtenByGammaUserId: string,
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  scheduledPublish?: Date
) {
  if ((await getServerSession(authConfig))?.user?.id !== writtenByGammaUserId) {
    redirect('/');
  }

  await NewsService.edit({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    scheduledPublish,
    id: id
  });
  redirect('/');
}

export async function postForGroup(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  divisionSuperGroupId: string,
  scheduledPublish?: Date
) {
  const session = await getServerSession(authConfig);
  await NewsService.post({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    divisionSuperGroupId,
    scheduledPublish,
    writtenByGammaUserId: session?.user?.id!,
    status: scheduledPublish ? PostStatus.SCHEDULED : PostStatus.PUBLISHED
  });
  redirect('/');
}
