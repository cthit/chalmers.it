import { getData } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import NewsPost from '@/components/NewsList/NewsPost/NewsPost';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import i18nService from '@/services/i18nService';
import NewsService from '@/services/newsService';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';
import Divider from '@/components/Divider/Divider';
import LargeCalendar from '@/components/LargeCalendar/LargeCalendar';
import { EventInput, EventSourceInput } from '@fullcalendar/react';
import ActionLink from '@/components/ActionButton/ActionLink';

export default async function Page(props: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const params = await props.params;
  const post = await NewsService.get(+params.id);
  if (!post) notFound();
  const postData = await getData(post, params.locale);
  if (!postData) notFound();

  const l = i18nService.getLocale(params.locale);

  const events: EventSourceInput = post.connectedEvents.map(
    (event) =>
      ({
        title: l.en ? event.titleEn : event.titleSv,
        allDay: event.fullDay,
        color: 'var(--primary)',
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
  );

  return (
    <main>
      <ThreePaneLayout
        middle={
          <div className={styles.column}>
            <ContentPane>
              {post && (
                <NewsPost standalone locale={params.locale} post={postData} />
              )}
            </ContentPane>
            {events.length > 0 && (
              <ContentPane>
                <h2>{l.news.connectedEvents}</h2>
                <Divider />
                <LargeCalendar
                  className={styles.calendar}
                  locale={params.locale}
                  events={events}
                  initialDate={post.connectedEvents[0].startTime}
                  initialView="listYear"
                  headerToolbar={false}
                />
                <div>
                  <ActionLink
                    className={styles.seeAllEventsButton}
                    href="/events"
                  >
                    {l.events.seeAll}
                  </ActionLink>
                </div>
              </ContentPane>
            )}
          </div>
        }
        right={<ContactCard locale={params.locale} />}
      />
    </main>
  );
}
