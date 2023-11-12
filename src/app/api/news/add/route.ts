import NewsService from '@/services/newsService';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest, ctx: { params?: unknown }) {
  return NewsService.post();
}
