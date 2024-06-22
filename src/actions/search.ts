'use server';

import NewsService from '@/services/newsService';

export async function search(query: string, before?: Date, after?: Date) {
  return await NewsService.search(query, before, after);
}
