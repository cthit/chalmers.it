import ApiService from '@/services/apiService';
import NewsService from '@/services/newsService';
import RssFeedService from '@/services/rssService';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const maxPageSize: number = parseInt(process.env.MAX_PAGE_SIZE ?? '50');

export async function GET(
  request: NextRequest,
  _ctx: { params: Promise<any> }
) {
  const search = request.nextUrl.searchParams;


  const page: number = parseInt(search.get('page') ?? '1');
  const pageSize: number = parseInt(search.get('pageSize') ?? '10');

  if (isNaN(page)) return ApiService.jsonError('Invalid page number');
  if (isNaN(pageSize)) return ApiService.jsonError('Invalid page size');

  if (page < 1)
    return ApiService.jsonError('Invalid page number, must be at least 1');

  if (pageSize < 1 || pageSize > maxPageSize)
    return ApiService.jsonError(
      'Invalid page size, must be between 1 and ' + maxPageSize
    );

  const news = await NewsService.getPage(page, pageSize);

  const responseFormat = search.get('format');
  if (responseFormat === 'rss') {
    const locale = search.get('locale') ?? 'sv';
    const rssXml = RssFeedService.generateFeed(
      news,
      locale,
      process.env.BASE_URL ?? 'http://localhost:3000'
    );

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Content-Disposition': 'inline; filename="news.xml"'
      }
    });
  }

  return NextResponse.json(news);
}
