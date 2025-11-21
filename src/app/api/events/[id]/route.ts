import ApiService from '@/services/apiService';
import EventService from '@/services/eventService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const params = await ctx.params;
  const id: number = parseInt(params.id);

  if (isNaN(id)) return ApiService.jsonError('Invalid event id');

  const newsPost = await EventService.get(id);
  if (newsPost === null) {
    return ApiService.jsonError('Event not found', 404);
  }

  return NextResponse.json(newsPost);
}
