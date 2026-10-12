'use client';

import FullCalendar, {
  ButtonInput,
  CalendarOptions,
  EventDisplayInfo,
  SlotHeaderInfo,
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

export type LargeCalendarClientProps = Omit<
  CalendarOptions,
  | 'colorScheme'
  | 'plugins'
  | 'controller'
  | 'eventContent'
  | 'dayCellTopInnerClass'
  | 'eventClass'
  | 'buttons'
  | 'todayText'
  | 'allDayText'
  | 'noEventsText'
  | 'weekNumberFormat'
  | 'weekNumberHeaderContent'
  | 'inlineWeekNumberContent'
> & { locale: string };

const LargeCalendarClient = ({
  initialView = 'timeGridWeek',
  headerToolbar = {
    left: 'today prev,next title',
    right: 'day,week,month,listWeek'
  },
  locale,
  className,
  borderless = true,
  weekNumbers = true,
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

  const createButton = (view: string, text: string): ButtonInput => {
    const isSelected = controller.view?.type === view;

    return {
      text,
      click: () => controller.changeView(view),
      className: isSelected ? styles.selectedButton : null
    };
  };

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
        day: createButton('timeGridDay', l.events.day),
        week: createButton('timeGridWeek', l.events.week),
        month: createButton('dayGridMonth', l.events.month),
        listWeek: createButton('listWeek', l.events.list)
      }}
      headerToolbar={headerToolbar}
      todayText={l.events.today}
      allDayText={l.events.fullDay}
      noEventsText={l.events.noEvents}
      weekNumbers={weekNumbers}
      weekNumberFormat={{
        week: 'narrow'
      }}
      weekNumberHeaderContent={(info) =>
        l.en ? info.text : info.text.replace('W', 'v')
      }
      inlineWeekNumberContent={(info) =>
        l.en ? info.text : info.text.replace('W', 'v')
      }
      titleFormat={{
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }}
      views={{
        dayGridMonth: {
          showNonCurrentDates: false,
          listItemEventBeforeClass: styles.eventDot
        }
      }}
      nowIndicator={true}
      className={styles.calendar + ' ' + className}
      eventContent={renderEventContent(locale)}
      dayCellTopInnerClass={styles.dayCellTopInner}
      allDayHeaderClass={styles.sidebar + ' ' + styles.allDayHeader}
      weekNumberHeaderClass={styles.sidebar}
      slotHeaderClass={styles.sidebar}
      timedText=".sidebar"
      slotHeaderContent={(info: SlotHeaderInfo) => {
        const parts = info.text.split(/(?=[pa]m)/i, 2);
        if (parts.length <= 1) {
          return parts[0];
        }
        return (
          <>
            {parts[0]}
            <wbr />
            {parts[1]}
          </>
        );
      }}
      rowEventAfterClass={styles.eventAfterArrow}
      rowEventBeforeClass={styles.eventBeforeArrow}
      borderless={borderless}
      eventClass={(eventInfo: EventDisplayInfo) =>
        styles.event +
        ' ' +
        (eventInfo.isInteractive ? '' : styles.eventNonInteractive) +
        ' ' +
        (eventInfo.isNarrow ? styles.narrow : '') +
        ' ' +
        (eventInfo.event.allDay ? styles.allDay : '') +
        ' ' +
        (eventInfo.isStart ? styles.eventStart : '') +
        ' ' +
        (eventInfo.isEnd ? styles.eventEnd : '')
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

    const isBlockView = ['dayGridMonth'].includes(eventInfo.view.type);
    const isListView = eventInfo.view.type.includes('list');

    return (
      <>
        <div className={styles.time + ' ' + eventInfo.timeClass}>
          {eventInfo.timeText}
        </div>
        <div
          className={
            eventInfo.titleClass +
            ' ' +
            (isBlockView ? styles.block : isListView ? styles.list : '')
          }
        >
          <b
            className={
              styles.title +
              ' ' +
              (eventInfo.isInteractive ? styles.eventHoverUnderline : '')
            }
          >
            {eventInfo.event.title}
          </b>
          {location && (
            <div
              lang={locale}
              className={eventInfo.titleClass + ' ' + styles.location}
            >
              {location}
            </div>
          )}
        </div>
      </>
    );
  };
}
