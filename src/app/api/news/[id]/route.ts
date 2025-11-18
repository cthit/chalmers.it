import ApiService from '@/services/apiService';
import NewsService from '@/services/newsService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const params = await ctx.params;
  const id: number = parseInt(params.id);

  if (isNaN(id)) return ApiService.jsonError('Invalid news id');

  const newsPost = await NewsService.get(id);
  if (newsPost === null) {
    return ApiService.jsonError('News post not found', 404);
  }

  return NextResponse.json(newsPost);
}
