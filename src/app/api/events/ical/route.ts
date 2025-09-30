import EventService from '@/services/eventService';
import { NextRequest, NextResponse } from 'next/server';
import { Calendar, CalendarEvent, dump, parseCalendar } from 'iamcal';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, _ctx: { params?: unknown }) {
  const events = await EventService.getAll();
  const calendar = new Calendar('cthit');

  for (const event of events) {
    calendar.addComponent(
      new CalendarEvent(event.id.toString(), event.startTime, event.startTime)
        .setEnd(event.endTime)
        .setSummary(event.titleSv)
    );
  }
  const ical = calendar.serialize();

  return new NextResponse(ical, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="events.ics"'
    }
  });
}
