import NewsService from '@/services/newsService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, ctx: { params?: unknown }) {
  return NextResponse.json(await NewsService.getAll());
}
