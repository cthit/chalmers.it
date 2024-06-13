import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import ActionLink from '../ActionButton/ActionLink';
import CalendarClient from './CalendarClient';
import i18nService from '@/services/i18nService';
import { getAllEvents } from '@/actions/events';

const Calendar = async ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const events = await getAllEvents();

  return (
    <ContentPane>
      <h1>{l.events.events}</h1>
      <Divider />
      <CalendarClient locale={locale} events={events} />
      <ActionLink
        target="_blank"
        href="https://calendar.google.com/calendar/embed?src=a55ipd3o49n05cd2eebqo854qs@group.calendar.google.com"
      >
        {l.events.subscribe}
      </ActionLink>
    </ContentPane>
  );
};

export default Calendar;
