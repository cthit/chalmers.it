'use server';

import NewsService from '@/services/newsService';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import { redirect } from 'next/navigation';
import { PostStatus } from '@prisma/client';
import MediaService from '@/services/mediaService';
import { MediaType } from '@/services/fileService';
import SessionService from '@/services/sessionService';

export async function post(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  files: FormData,
  scheduledPublish?: Date
) {
  const session = await getServerSession(authConfig);
  if (!(await SessionService.isActive(session))) {
    throw new Error('Unauthorized');
  }

  for (const file of files.getAll('file') as unknown as File[]) {
    await MediaService.save(file, Object.values(MediaType));
  }

  const res = await NewsService.post({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    scheduledPublish,
    writtenByGammaUserId: session?.user?.id!,
    status: scheduledPublish ? PostStatus.SCHEDULED : PostStatus.PUBLISHED
  });
  return res.id;
}

export async function edit(
  id: number,
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  files: FormData,
  scheduledPublish?: Date | null
) {
  if (!(await SessionService.isNewsPostOwner(id))) {
    throw new Error('Unauthorized');
  }

  for (const file of files.getAll('file') as unknown as File[]) {
    await MediaService.save(file, Object.values(MediaType));
  }

  await NewsService.edit({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    scheduledPublish,
    id: id
  });
}

export async function postForGroup(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  divisionSuperGroupId: string,
  files: FormData,
  scheduledPublish?: Date
) {
  const session = await getServerSession(authConfig);

  if (!(await SessionService.canEditGroup(divisionSuperGroupId, session))) {
    throw new Error('Unauthorized');
  }

  for (const file of files.getAll('file') as unknown as File[]) {
    await MediaService.save(file, Object.values(MediaType));
  }

  const res = await NewsService.post({
    titleEn,
    titleSv,
    contentEn,
    contentSv,
    divisionSuperGroupId,
    scheduledPublish,
    writtenByGammaUserId: session?.user?.id!,
    status: scheduledPublish ? PostStatus.SCHEDULED : PostStatus.PUBLISHED
  });
  return res.id;
}

export async function deletePost(id: number) {
  if (
    !(await SessionService.isAdmin()) &&
    !(await SessionService.isNewsPostOwner(id))
  ) {
    throw new Error('Unauthorized');
  }

  await NewsService.remove(id);
  redirect('.');
}
