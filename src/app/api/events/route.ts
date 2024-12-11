import EventService from '@/services/eventService';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest) {
  return NextResponse.json(await EventService.getAll());
}
