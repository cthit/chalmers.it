'use server';

import NewsService from '@/services/newsService';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import { redirect } from 'next/navigation';

export async function post(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string
) {
  const session = await getServerSession(authConfig);
  await NewsService.post({
    titleEn: titleEn,
    titleSv: titleSv,
    contentEn: contentEn,
    contentSv: contentSv,
    writtenByGammaUserId: session?.user?.id!
  });
  redirect('/');
}

export async function edit(
  id: number,
  writtenByGammaUserId: string,
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string
) {
  if ((await getServerSession(authConfig))?.user?.id !== writtenByGammaUserId) {
    redirect('/');
  }

  await NewsService.edit({
    titleEn: titleEn,
    titleSv: titleSv,
    contentEn: contentEn,
    contentSv: contentSv,
    id: id
  });
  redirect('/');
}

export async function postForGroup(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  divisionSuperGroupId: string
) {
  const session = await getServerSession(authConfig);
  await NewsService.post({
    titleEn: titleEn,
    titleSv: titleSv,
    contentEn: contentEn,
    contentSv: contentSv,
    writtenByGammaUserId: session?.user?.id!,
    divisionSuperGroupId: divisionSuperGroupId
  });
  redirect('/');
}
