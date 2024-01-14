'use server';

import NewsService from '@/services/newsService';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';

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
    writtenByCid: session?.user?.id!
  });
}
