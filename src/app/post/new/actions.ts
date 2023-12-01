'use server';

import NewsService from '@/services/newsService';

export async function post(
  titleEn: string,
  titleSv: string,
  contentEn: string,
  contentSv: string,
  writtenByCid: string
) {
  await NewsService.post({
    titleEn: titleEn,
    titleSv: titleSv,
    contentEn: contentEn,
    contentSv: contentSv,
    writtenByCid: writtenByCid
  });
}
