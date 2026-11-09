'use client';

import FullCalendar, {
  ButtonInput,
  CalendarController,
  CalendarOptions,
  DayCellInfo,
  DayHeaderInfo,
  EventDisplayInfo,
  InlineWeekNumberInfo,
  ListDayHeaderInnerInfo,
  SlotHeaderInfo,
  useCalendarController,
  WeekNumberHeaderInfo
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
import clsx from 'clsx/lite';

export type LargeCalendarClientProps = CalendarOptions & {
  locale: string;
  className: string;
};

const LargeCalendarClient = ({
  locale,
  className,
  ...overrides
}: LargeCalendarClientProps) => {
  const [mounted, setMounted] = useState(false);
  const controller = useCalendarController();
  const { resolvedTheme, systemTheme } = useTheme();

  const l = i18nService.getLocale(locale);
  const isEn = locale === 'en';

  useEffect(() => {
    setMounted(true);
  });

  if (!mounted) {
    return null;
  }

  const createViewButton = (view: string, text: string): ButtonInput => {
    const isSelected = controller.view?.type === view;

    return {
      text,
      click: () => controller.changeView(view),
      className: clsx(isSelected && styles.selectedButton)
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

      // General
      locale={locale}
      colorScheme={resolvedTheme ?? systemTheme}
      className={clsx(
        styles.calendar,
        controller.view?.type.includes('list') && styles.listView,
        className
      )}
      nowIndicator={true}
      showNonCurrentDates={false}
      borderless={true}
      firstDay={1}
      allDayText={l.events.fullDay}
      noEventsText={l.events.noEvents}

      // Views
      views={{
        timeGridDay: {
          dayHeaderRowClass: styles.hide,
          dayHeaderDividerClass: styles.hide
        },
        dayGridMonth: {
          eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            omitZeroMinute: true
          }
        }
      }}
      initialView="timeGridWeek"
      viewClass={styles.viewBody}

      listItemEventBeforeClass={styles.eventDot}
      dayCellTopInnerClass={styles.dayCellTopInner}

      listDayHeaderContent={renderListDayHeaderContent(locale)}
      listDayHeaderClass={styles.listDayHeader}
      listDayClass={styles.listDay}

      // Header
      buttons={{
        day: createViewButton('timeGridDay', l.events.day),
        week: createViewButton('timeGridWeek', l.events.week),
        month: createViewButton('dayGridMonth', l.events.month),
        listWeek: createViewButton('listWeek', l.events.list)
      }}
      headerToolbar={{
        left: 'today prev,next title',
        right: 'day,week,month,listWeek'
      }}
      headerToolbarClass={styles.headerToolbar}
      titleFormat={renderTitle(controller.view?.type)}
      todayText={l.events.today}
      todayHint={(info) =>
        l.events.todayHint[
          info.toLowerCase() as keyof typeof l.events.todayHint
        ]
      }
      dayHeaderContent={renderDayContent(controller)}
      dayHeaderClass={styles.dayHeader}

      // Events
      eventContent={renderEventContent(locale)}
      eventClass={(info: EventDisplayInfo) =>
        clsx(
          styles.event,
          info.isInteractive && styles.eventInteractive,
          info.isNarrow && styles.narrow,
          info.event.allDay && styles.allDay,
          info.isStart && styles.eventStart,
          info.isEnd && styles.eventEnd,
          info.view.type === 'dayGridMonth' && styles.blockEvent,
          info.view.type.includes('list') && styles.listEvent
        )
      }
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }}
      rowEventClass={styles.rowEvent}
      rowEventAfterClass={styles.eventAfterArrow}
      rowEventBeforeClass={styles.eventBeforeArrow}
      dayCellTopContent={renderDayContent(controller)}

      // Week numbers
      weekNumbers={true}
      weekNumberFormat={{
        week: 'narrow'
      }}
      weekNumberHeaderContent={renderWeekNumberHeaderContent(isEn)}
      inlineWeekNumberContent={renderInlineWeekNumberContent(controller, isEn)}
      inlineWeekNumberClass={styles.inlineWeekNumber}

      // Sidebar
      slotHeaderClass={styles.sidebar}
      allDayHeaderClass={clsx(styles.sidebar, styles.allDayHeader)}
      weekNumberHeaderClass={styles.sidebar}
      timedText=".sidebar" // Workaround as there is no property to set class
      slotHeaderContent={renderSlotHeaderContent}

      // Overrides
      {...overrides}
    />
  );
};

export default LargeCalendarClient;

function renderEventContent(locale: string) {
  return (info: EventDisplayInfo): ReactNode | null => {
    const rawLocation: unknown = info.event.extendedProps['location'];
    const location: string | null =
      typeof rawLocation === 'string' ? rawLocation : null;

    const timeContent = info.isNarrow
      ? info.timeText.replaceAll(/:00/g, '')
      : info.timeText;

    return (
      <>
        <div className={clsx(info.timeClass, styles.eventTime)}>
          {timeContent}
        </div>
        <div className={clsx(info.titleClass, styles.eventInfo)}>
          <b
            className={clsx(
              styles.eventTitle,
              info.isInteractive && styles.eventHoverUnderline
            )}
          >
            {info.event.title}
          </b>
          {location && (
            <div
              lang={locale}
              className={clsx(info.titleClass, styles.eventLocation)}
            >
              {location}
            </div>
          )}
        </div>
      </>
    );
  };
}

type DayInfo = Pick<
  DayHeaderInfo & DayCellInfo,
  | 'date'
  | 'dayNumberText'
  | 'weekdayText'
  | 'text'
  | 'isNarrow'
  | 'isToday'
  | 'view'
>;

function renderDayContent(controller: CalendarController) {
  return (info: DayInfo) => {
    if (info.dayNumberText === '' && info.view.type === 'dayGridMonth') {
      return info.text.substring(0, 3);
    }

    const clickHandler = () => {
      controller.changeView('timeGridDay');
      controller.gotoDate(info.date);
    };

    return (
      <div className={styles.day}>
        {info.weekdayText && (
          <div className={styles.weekday}>{info.weekdayText}</div>
        )}
        <div
          className={clsx(
            styles.innerDay,
            info.isNarrow && styles.narrow,
            info.isToday && styles.today
          )}
          onClick={clickHandler}
        >
          {info.dayNumberText}
        </div>
      </div>
    );
  };
}

function renderWeekNumberHeaderContent(isEn: boolean) {
  return (info: WeekNumberHeaderInfo) =>
    isEn ? (
      info.text
    ) : (
      <span>
        v<wbr />
        {info.text.replace('W', '')}
      </span>
    );
}

function renderInlineWeekNumberContent(
  controller: CalendarController,
  isEn: boolean
) {
  return (info: InlineWeekNumberInfo) => {
    const clickHandler = () => {
      controller.changeView('timeGridWeek');
      controller.gotoDate(info.date);
    };
    return (
      <div onClick={clickHandler}>
        {isEn ? info.text : info.text.replace('W', 'v')}
      </div>
    );
  };
}

function renderListDayHeaderContent(locale: string) {
  return (info: ListDayHeaderInnerInfo) => {
    if (info.weekdayText !== '') {
      return info.weekdayText;
    }

    const now = new Date();
    const isThisYear = info.date.getFullYear() === now.getFullYear();

    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      ...(isThisYear
        ? {}
        : {
            year: 'numeric'
          })
    }).format(info.date);
  };
}

function renderTitle(viewType?: string): CalendarOptions['titleFormat'] {
  return (info) => {
    if (viewType === 'dayGridMonth') {
      return new Intl.DateTimeFormat(info.localeCodes[0], {
        month: 'long',
        year: 'numeric'
      }).format(info.start.instantMs);
    }

    const now = new Date();
    const isThisYear =
      info.start.year === now.getFullYear() &&
      (info.end == undefined || info.end.year === now.getFullYear());

    if (info.end && viewType !== 'timeGridDay') {
      return new Intl.DateTimeFormat(info.localeCodes[0], {
        day: 'numeric',
        month: 'short',
        ...(isThisYear
          ? {}
          : {
              year: 'numeric'
            })
      }).formatRange(info.start.instantMs, info.end.instantMs);
    }

    return new Intl.DateTimeFormat(info.localeCodes[0], {
      day: 'numeric',
      month: 'long',
      ...(isThisYear
        ? {}
        : {
            year: 'numeric'
          })
    }).format(info.start.instantMs);
  };
}

function renderSlotHeaderContent(info: SlotHeaderInfo) {
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
}
