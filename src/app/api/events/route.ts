import EventService from '@/services/eventService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, ctx: { params?: unknown }) {
  return NextResponse.json(await EventService.getAll());
}
