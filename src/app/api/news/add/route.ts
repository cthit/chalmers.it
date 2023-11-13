import NewsService from '@/services/newsService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, ctx: { params?: unknown }) {
  NewsService.post(
    {
      titleEn: 'Test news post',
      titleSv: 'Testnyhet',
      contentEn: 'This is a test news post for testing news.\nThis time, we have support for emojis! 😀',
      contentSv: 'Detta är en testnyhet för att testa nyheter.\nDet finns även stöd för emojis! 😀',
      writtenByCid: 'Goose'
    }
  );
  return NextResponse.json({ message: 'success'});
}
