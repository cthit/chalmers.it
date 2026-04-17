import ApiService from '@/services/apiService';
import NewsService from '@/services/newsService';
import { PostStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const search = request.nextUrl.searchParams;
  const params = await ctx.params;

  const id: number = parseInt(params.id);
  if (isNaN(id) || id < 0) return ApiService.jsonError('Invalid news id');

  const newsPost = await NewsService.get(id);
  if (newsPost === null || newsPost.status !== PostStatus.PUBLISHED) {
    return ApiService.jsonError('News post not found', 404);
  }

  switch (search.get('format') ?? 'json') {
    case 'slack':
      const lang = search.get('lang') === 'en' ? 'EN' : 'SV';
      return NextResponse.json(await NewsService.serializeToSlack(id, lang));
    case 'json':
    default:
      return NextResponse.json(newsPost);
  }
}
