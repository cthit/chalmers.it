import { getData } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import NewsPost from '@/components/NewsList/NewsPost/NewsPost';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import i18nService from '@/services/i18nService';
import NewsService from '@/services/newsService';
import { parseIdParam } from '@/utils/params';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';
import Divider from '@/components/Divider/Divider';
import LargeCalendar from '@/components/LargeCalendar/LargeCalendar';
import { EventInput, EventSourceInput } from '@fullcalendar/react';
import ActionLink from '@/components/ActionButton/ActionLink';

export async function generateMetadata(props: {
  params: Promise<{ id: string; locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const id = parseIdParam(params.id);
  if (id === null) notFound();
  const post = await NewsService.get(id);
  if (!post) notFound();
  const isEn = params.locale === 'en';

  return {
    title: isEn ? post.titleEn : post.titleSv
  };
}

export default async function Page(props: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const params = await props.params;
  const id = parseIdParam(params.id);
  if (id === null) notFound();
  const post = await NewsService.get(id);
  if (!post) notFound();
  const postData = await getData(post, params.locale);
  if (!postData) notFound();

  return (
    <main>
      <ThreePaneLayout
        middle={
          <div className={styles.column}>
            <ContentPane>
              {post && (
                <NewsPost
                  standalone
                  locale={params.locale}
                  post={postData}
                  hideEventLanguage
                />
              )}
            </ContentPane>
            {post.connectedEvents.length > 0 && (
              <ConnectedEventsPane
                locale={params.locale}
                connectedEvents={post.connectedEvents}
              />
            )}
          </div>
        }
        right={<ContactCard locale={params.locale} />}
      />
    </main>
  );
}

type ConnectedEvents = Exclude<
  Awaited<ReturnType<typeof NewsService.get>>,
  null
>['connectedEvents'];

function ConnectedEventsPane({
  locale,
  connectedEvents
}: {
  locale: string;
  connectedEvents: ConnectedEvents;
}) {
  if (connectedEvents.length === 0) {
    throw new Error('No connected events');
  }

  const l = i18nService.getLocale(locale);

  const events = connectedEvents.map(
    (event) =>
      ({
        title: l.en ? event.titleEn : event.titleSv,
        allDay: event.fullDay,
        color: 'var(--primary)',
        extendedProps: {
          location: event.location,
          language: event.language
        },
        ...(event.fullDay
          ? {
              date: event.startTime,
              start: undefined,
              end: undefined
            }
          : {
              date: undefined,
              start: event.startTime,
              end: event.endTime
            })
      }) satisfies EventInput
  ) satisfies EventSourceInput;

  // Find time span of events
  const eventsStart = connectedEvents.reduce<Date | undefined>((min, val) => {
    if (!min) {
      return val.startTime;
    }
    return val.startTime < min ? val.startTime : min;
  }, undefined) as Date;
  const eventsEnd = connectedEvents.reduce<Date | undefined>((max, val) => {
    if (!max) {
      return val.endTime;
    }
    return val.endTime > max ? val.endTime : max;
  }, undefined) as Date;
  const timeSpan = eventsEnd.getTime() - eventsStart.getTime();

  return (
    <ContentPane>
      <h2>{l.news.connectedEvents}</h2>
      <Divider />
      <LargeCalendar
        className={styles.calendar}
        locale={locale}
        events={events}
        headerToolbar={false}
        initialView="list"
        initialDate={eventsStart}
        duration={{
          milliseconds: timeSpan
        }}
      />
      <div>
        <ActionLink className={styles.seeAllEventsButton} href="/events">
          {l.events.seeAll}
        </ActionLink>
      </div>
    </ContentPane>
  );
}
