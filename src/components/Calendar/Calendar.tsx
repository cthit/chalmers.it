import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import ActionLink from '../ActionButton/ActionLink';
import EventService from '@/services/eventService';
import CalendarClient from './CalendarClient';
import i18nService from '@/services/i18nService';

const stripTime = (d: Date) => {
  return d.setHours(0, 0, 0, 0);
};

const Calendar = async ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);

  const events = await EventService.getAll();
  const eventMap: {
    [key: number]: {
      id: number;
      titleSv: string;
      titleEn: string;
      descriptionEn: string;
      descriptionSv: string;
      fullDay: boolean;
      startTime: Date;
      endTime: Date;
      location: string | null;
      createdAt: Date;
      updatedAt: Date;
      newsPostId: number | null;
    }[];
  } = {};

  events.forEach((event) => {
    const date = stripTime(event.startTime);
    if (!eventMap[date]) {
      eventMap[date] = [];
    }
    eventMap[date].push(event);
  });

  return (
    <ContentPane>
      <h1>{l.events.events}</h1>
      <Divider />
      <CalendarClient locale={locale} events={eventMap} />
      <ActionLink href="/">{l.events.subscribe}</ActionLink>
    </ContentPane>
  );
};

export default Calendar;
