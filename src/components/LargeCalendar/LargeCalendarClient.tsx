'use client';

import FullCalendar, {
  CalendarOptions,
  EventDisplayInfo,
  useCalendarController
} from '@fullcalendar/react';
import themePlugin from '@fullcalendar/react/themes/forma';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import listPlugin from '@fullcalendar/react/list';
import multiMonthPlugin from '@fullcalendar/react/multimonth';

import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/forma/theme.css';
import './LargeCalendar.scss'; // Custom Forma palette
import { useTheme } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

import styles from './LargeCalendar.module.scss';
import i18nService from '@/services/i18nService';
import { SpokenLanguage } from '@prisma/client';
import SpokenLanguageIndicator from '../SpokenLanguageIndicator/SpokenLanguageIndicator';

export type LargeCalendarClientProps = Omit<
  CalendarOptions,
  | 'colorScheme'
  | 'plugins'
  | 'controller'
  | 'views'
  | 'eventContent'
  | 'dayCellTopInnerClass'
  | 'eventClass'
  | 'buttons'
  | 'todayText'
> & { locale: string };

const LargeCalendarClient = ({
  initialView = 'timeGridWeek',
  headerToolbar = {
    left: 'today,prev,next,title',
    right: 'day,week,month,list'
  },
  locale,
  ...rest
}: LargeCalendarClientProps) => {
  const [mounted, setMounted] = useState(false);
  const controller = useCalendarController();
  const { resolvedTheme, systemTheme } = useTheme();

  const l = i18nService.getLocale(locale);

  useEffect(() => {
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  return (
    <FullCalendar
      plugins={[
        themePlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        multiMonthPlugin
      ]}
      controller={controller}
      editable={false}
      locale={locale}
      colorScheme={resolvedTheme ?? systemTheme}
      initialView={initialView}
      firstDay={1}
      buttons={{
        day: {
          text: l.events.day,
          click: () => controller.changeView('timeGridDay')
        },
        week: {
          text: l.events.week,
          click: () => controller.changeView('timeGridWeek')
        },
        month: {
          text: l.events.month,
          click: () => controller.changeView('dayGridMonth')
        },
        list: {
          text: l.events.list,
          click: () => controller.changeView('listWeek')
        }
      }}
      headerToolbar={headerToolbar}
      todayText={l.events.today}
      views={{
        listWeek: {
          titleFormat: {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }
        }
      }}
      nowIndicator={true}
      eventContent={renderEventContent(locale)}
      dayCellTopInnerClass={styles.dayCellTopInner}
      eventClass={(eventInfo: EventDisplayInfo) =>
        styles.event +
        ' ' +
        (eventInfo.isInteractive ? '' : styles.eventNonInteractive)
      }
      {...rest}
    />
  );
};

export default LargeCalendarClient;

function renderEventContent(locale: string) {
  return (eventInfo: EventDisplayInfo): ReactNode | null => {
    const rawLocation: unknown = eventInfo.event.extendedProps['location'];
    const location: string | null =
      typeof rawLocation === 'string' ? rawLocation : null;
    const rawSpokenLanguage: unknown =
      eventInfo.event.extendedProps['spokenLanguage'];
    const spokenLanguage: SpokenLanguage | null =
      typeof rawSpokenLanguage === 'string'
        ? (SpokenLanguage[rawSpokenLanguage as SpokenLanguage] ?? null)
        : null;

    const isBlockView = ['dayGridMonth'].includes(eventInfo.view.type);
    const isListView = eventInfo.view.type.includes('list');

    return (
      <>
        <div className={eventInfo.timeClass}>{eventInfo.timeText}</div>
        <div
          className={
            eventInfo.titleClass +
            ' ' +
            (isBlockView ? styles.block : isListView ? styles.list : '')
          }
        >
          <b
            className={
              eventInfo.isInteractive ? styles.eventHoverUnderline : ''
            }
          >
            {eventInfo.event.title}
          </b>
          {location && (
            <div className={eventInfo.titleClass + ' ' + styles.location}>
              {location}
            </div>
          )}
          {!isBlockView && spokenLanguage && (
            <SpokenLanguageIndicator
              locale={locale}
              language={spokenLanguage}
              iconOnly
              className={styles.spokenLanguage}
            />
          )}
        </div>
      </>
    );
  };
}
