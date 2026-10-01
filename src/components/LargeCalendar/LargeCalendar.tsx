import EventService from '@/services/eventService';
import LargeCalendarClient from '@/components/LargeCalendar/LargeCalendarClient';
import { EventSourceInput } from '@fullcalendar/react';

const LargeCalendar = async ({ locale }: { locale: string }) => {
  const isEn = locale === 'en';

  const events: EventSourceInput = await EventService.getAll().then((events) =>
    events.map((event) => ({
      title: isEn ? event.titleEn : event.titleSv,
      allDay: event.fullDay,
      ...(event.fullDay
        ? {
            date: event.startTime
          }
        : {
            start: event.startTime,
            end: event.endTime
          })
    }))
  );

  return <LargeCalendarClient locale={locale} events={events} />;
};

export default LargeCalendar;
