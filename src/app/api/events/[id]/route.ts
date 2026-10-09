import ApiService from '@/services/apiService';
import EventService from '@/services/eventService';
import { NextRequest, NextResponse } from 'next/server';
import { parseIdParam } from '@/utils/params';

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const params = await ctx.params;
  const id = parseIdParam(params.id);

  if (id === null) return ApiService.jsonError('Invalid event id');

  const newsPost = await EventService.get(id);
  if (newsPost === null) {
    return ApiService.jsonError('Event not found', 404);
  }

  return NextResponse.json(newsPost);
}
