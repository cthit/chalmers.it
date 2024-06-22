'use server';

import NewsService from '@/services/newsService';

export async function search(query: string) {
  return await NewsService.search(query);
}
