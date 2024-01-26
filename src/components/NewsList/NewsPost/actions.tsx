'use server';

import NewsService from '@/services/newsService';
import { redirect } from 'next/navigation';

export async function deletePost(id: number) {
  await NewsService.remove(id);
  redirect('.');
}
