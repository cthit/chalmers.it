import i18nConfig from '@/i18nConfig';
import ApiService from '@/services/apiService';
import EventService from '@/services/eventService';
import i18nService from '@/services/i18nService';
import { NextRequest, NextResponse } from 'next/server';
import {
  Calendar,
  CalendarDate,
  CalendarDateTime,
  CalendarDuration,
  CalendarEvent
} from 'iamcal';
import NewsService from '@/services/newsService';
import { Event } from '@prisma/client';
import GammaService from '@/services/gammaService';
import { imgMatcher } from '@/utils/mediaLink';

export const dynamic = 'force-dynamic';

const maxPageSize: number = parseInt(process.env.MAX_PAGE_SIZE ?? '50');

export async function GET(
  request: NextRequest,
  _ctx: { params: Promise<any> }
) {
  const search = request.nextUrl.searchParams;

  const responseFormat = search.get('format');
  if (responseFormat === 'ical') {
    // iCalendar response
    const locale = search.get('locale') ?? 'sv';

    return await createCalendarResponse(locale);
  } else {
    // JSON response is default
    const page: number = parseInt(search.get('page') ?? '1');
    const pageSize: number = parseInt(search.get('pageSize') ?? '10');

    return await createJsonResponse(page, pageSize);
  }
}

async function createJsonResponse(
  page: number,
  pageSize: number
): Promise<NextResponse> {
  if (isNaN(page)) return ApiService.jsonError('Invalid page number');
  if (isNaN(pageSize)) return ApiService.jsonError('Invalid page size');

  if (page < 1)
    return ApiService.jsonError('Invalid page number, must be at least 1');

  if (pageSize < 1 || pageSize > maxPageSize)
    return ApiService.jsonError(
      'Invalid page size, must be between 1 and ' + maxPageSize
    );

  const events = await EventService.getPage(page, pageSize);
  return NextResponse.json(events);
}

async function createCalendarResponse(locale: string): Promise<NextResponse> {
  const invalidLocale = !i18nConfig.locales.includes(locale);
  if (invalidLocale) {
    return ApiService.jsonError('Invalid locale');
  }

  const l = i18nService.getLocale(locale);
  const isEn = locale === 'en';

  const events = await EventService.getAll();
  const calendar = new Calendar(
    `-//cthit//NONSGML chalmers.it//${locale.toUpperCase()}`
  )
    .setCalendarName(l.events.calendarName)
    .setCalendarDescription(l.events.calendarDescription);

  const oneDay = new CalendarDuration('P1D');
  for (const event of events) {
    const post =
      event.newsPostId != null ? await NewsService.get(event.newsPostId) : null;

    const uid = `cthit-event-${locale}-${event.id}`;
    const stamp = new CalendarDateTime(event.startTime, true);
    const start = event.fullDay
      ? new CalendarDate(event.startTime)
      : new CalendarDateTime(event.startTime, true);
    const end = event.fullDay
      ? // event.endTime is not used for full day events in order to be
        // compatible with how events are created. Instead the event is assumed
        // to be one day long.
        new CalendarDate(event.startTime).offset(oneDay)
      : new CalendarDateTime(event.endTime, true);

    const calEvent = new CalendarEvent(uid, stamp, start)
      .setEnd(end)
      .setSummary(isEn ? event.titleEn : event.titleSv);

    if (event.location) {
      calEvent.setLocation(event.location);
    }

    const description = await createCalendarEventDescription(
      event,
      post,
      locale
    );
    if (description) {
      calEvent.setDescription(description);
    }

    calendar.addComponent(calEvent);
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

type ExtendedNewsPost = Awaited<ReturnType<typeof NewsService.get>>;

async function createCalendarEventDescription(
  event: Event,
  post: ExtendedNewsPost,
  locale: string
): Promise<string> {
  const l = i18nService.getLocale(locale);
  const isEn = locale === 'en';
  const baseUrl = process.env.BASE_URL || 'https://chalmers.it';

  if (!post) {
    return (isEn ? event.descriptionEn : event.descriptionSv).trim();
  }

  const content = removeImageLinks(
    isEn
      ? event.descriptionEn || post.contentEn
      : event.descriptionSv || post.contentSv
  ).trim();

  const author = await GammaService.getNick(post.writtenByGammaUserId);
  const createdFor = post.writtenFor
    ? ` ${l.news.for} ${post.writtenFor.prettyName}`
    : '';

  const relatedEvents = post.connectedEvents
    .filter((connectedEvent) => connectedEvent.id !== event.id)
    .map((connectedEvent) => {
      const title = isEn ? connectedEvent.titleEn : connectedEvent.titleSv;
      const date = i18nService.formatDate(
        connectedEvent.startTime,
        !connectedEvent.fullDay
      );

      return `<li>${title} (${date})</li>`;
    });
  const relatedEventsPart =
    relatedEvents.length > 0
      ? `\n\n<b>${l.events.relatedEvents}:</b>\n<ul>${relatedEvents.join('\n')}</ul>`
      : '';

  return `<b>${l.events.created}${createdFor} ${l.news.by} ${author ?? l.news.unknown}</b>

${content}

${l.events.readMore}: ${baseUrl}/post/${post.id}${relatedEventsPart}`;
}

/**
 * Remove markdown image links such as ![Text](/api/media/xxxx).
 * @param text The text to remove links from.
 * @returns The same text with links removed. No whitespace around the link is trimmed.
 */
function removeImageLinks(text: string): string {
  return text.replaceAll(new RegExp(imgMatcher, 'g'), '');
}
