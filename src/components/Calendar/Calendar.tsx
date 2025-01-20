import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import ActionLink from '../ActionButton/ActionLink';
import CalendarClient from './CalendarClient';
import i18nService from '@/services/i18nService';
import { getAllEvents } from '@/actions/events';
import styles from './Calendar.module.scss';
import EventService from '@/services/eventService';

const Calendar = async ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const events = await getAllEvents();
  const nextEvents = (await EventService.getAll())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .filter((event) => event.endTime > new Date())
    .slice(0, 3);

  return (
    <ContentPane className={styles.centered}>
      <h1>{l.events.events}</h1>
      <Divider />
      <CalendarClient locale={locale} events={events} />
      <ActionLink
        target="_blank"
        href="https://calendar.google.com/calendar/embed?src=a55ipd3o49n05cd2eebqo854qs@group.calendar.google.com"
      >
        {l.events.subscribe}
      </ActionLink>
      <h1 className={styles.upcomingEventsTitle}>{l.events.comingEvents}</h1>
      <ul className={styles.eventsList}>
        {nextEvents.map((event) => {
          const ongoing = event.startTime < new Date();
          return (
            <li key={event.id}>
              <h2 className={styles.upcomingEventTitle}>
                {l.en ? event.titleEn : event.titleSv}
              </h2>
              <p className={styles.upcomingEventDetails}>
                {i18nService.formatDate(event.startTime, true)}
                {event.location && ', ' + event.location}{' '}
                {ongoing && `(${l.events.ongoing})`}
              </p>
            </li>
          );
        })}
      </ul>
    </ContentPane>
  );
};

export default Calendar;
