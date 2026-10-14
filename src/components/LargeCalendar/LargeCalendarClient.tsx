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
  const isEn = locale === 'en';

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
        isEn ? (
          info.text
        ) : (
          <span>
            v<wbr />
            {info.text.replace('W', '')}
          </span>
        )
      }
      inlineWeekNumberClass={styles.inlineWeekNumber}
      inlineWeekNumberContent={renderInlineWeekNumberContent(controller, isEn)}
      titleFormat={renderTitle(controller.view?.type)}
      listDayClass={styles.listDay}
      listDayHeaderClass={styles.listDayHeader}
      listDayHeaderContent={renderListDayHeaderContent(locale)}
      viewClass={styles.viewBody}
      views={{
        timeGridDay: {
          dayHeaderRowClass: styles.hide,
          dayHeaderDividerClass: styles.hide
        },
        dayGridMonth: {
          showNonCurrentDates: false,
          listItemEventBeforeClass: styles.eventDot,
          eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            omitZeroMinute: true
          }
        }
      }}
      nowIndicator={true}
      className={
        styles.calendar +
        ' ' +
        (controller.view?.type.includes('list') ? styles.listView : '') +
        ' ' +
        className
      }
      eventContent={renderEventContent(locale)}
      eventTimeFormat={{
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }}
      dayHeaderClass={styles.dayHeader}
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
      rowEventClass={styles.rowEvent}
      rowEventAfterClass={styles.eventAfterArrow}
      rowEventBeforeClass={styles.eventBeforeArrow}
      borderless={borderless}
      eventClass={(info: EventDisplayInfo) =>
        styles.event +
        ' ' +
        (info.isInteractive ? styles.eventInteractive : '') +
        ' ' +
        (info.isNarrow ? styles.narrow : '') +
        ' ' +
        (info.event.allDay ? styles.allDay : '') +
        ' ' +
        (info.isStart ? styles.eventStart : '') +
        ' ' +
        (info.isEnd ? styles.eventEnd : '') +
        ' ' +
        (info.view.type === 'dayGridMonth' ? styles.blockEvent : '') +
        ' ' +
        (info.view.type.includes('list') ? styles.listEvent : '')
      }
      dayHeaderContent={renderDayContent(controller)}
      dayCellTopContent={renderDayContent(controller)}
      {...rest}
    />
  );
};

export default LargeCalendarClient;

function renderEventContent(locale: string) {
  return (info: EventDisplayInfo): ReactNode | null => {
    const rawLocation: unknown = info.event.extendedProps['location'];
    const location: string | null =
      typeof rawLocation === 'string' ? rawLocation : null;

    return (
      <>
        <div className={info.timeClass + ' ' + styles.eventTime}>
          {info.timeText}
        </div>
        <div className={info.titleClass + ' ' + styles.eventInfo}>
          <b
            className={
              styles.eventTitle +
              ' ' +
              (info.isInteractive ? styles.eventHoverUnderline : '')
            }
          >
            {info.event.title}
          </b>
          {location && (
            <div
              lang={locale}
              className={info.titleClass + ' ' + styles.eventLocation}
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
          className={
            styles.innerDay +
            ' ' +
            (info.isNarrow ? styles.narrow : '') +
            ' ' +
            (info.isToday ? styles.today : '')
          }
          onClick={clickHandler}
        >
          {info.dayNumberText}
        </div>
      </div>
    );
  };
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
