import EventService from '@/services/eventService';
import i18nService from '@/services/i18nService';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import styles from './ComingEvents.module.scss';

const ComingEvents = async ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const events = (await EventService.getAll()).sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime()
  );
  const nextEvents = events
    .filter((event) => event.endTime > new Date())
    .slice(0, 3);

  return (
    <ContentPane>
      <h1>{l.events.comingEvents}</h1>
      <Divider />
      <ul className={styles.eventsList}>
        {nextEvents.map((event) => {
          const ongoing = event.startTime < new Date();
          return (
            <li key={event.id}>
              <h3>{l.en ? event.titleEn : event.titleSv}</h3>
              <p>
                {i18nService.formatDate(event.startTime, true)}
                {event.location && ', ' + event.location}{' '}
                {ongoing && '(Ongoing)'}
              </p>
            </li>
          );
        })}
      </ul>
    </ContentPane>
  );
};

export default ComingEvents;
