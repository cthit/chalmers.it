import EventService from '@/services/eventService';
import LargeCalendarClient, {
  LargeCalendarClientProps
} from '@/components/LargeCalendar/LargeCalendarClient';
import { EventInput, EventSourceInput } from '@fullcalendar/react';

export type LargeCalendarProps = Omit<LargeCalendarClientProps, 'events'>;

const LargeCalendar = async ({ locale, ...rest }: LargeCalendarProps) => {
  const isEn = locale === 'en';

  const events: EventSourceInput = await EventService.getAll().then((events) =>
    events.map(
      (event) =>
        ({
          title: isEn ? event.titleEn : event.titleSv,
          allDay: event.fullDay,
          url:
            event.newsPostId !== null
              ? `/${locale}/post/${event.newsPostId}`
              : undefined,
          extendedProps: {
            location: event.location
          },
          ...(event.fullDay
            ? {
                date: event.startTime
              }
            : {
                start: event.startTime,
                end: event.endTime
              })
        }) satisfies EventInput
    )
  );

  return <LargeCalendarClient locale={locale} events={events} {...rest} />;
};

export default LargeCalendar;
