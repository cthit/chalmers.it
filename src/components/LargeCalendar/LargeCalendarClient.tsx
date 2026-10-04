'use client';

import FullCalendar, { EventDisplayInfo } from '@fullcalendar/react';
import themePlugin from '@fullcalendar/react/themes/forma';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import listPlugin from '@fullcalendar/react/list';
import multiMonthPlugin from '@fullcalendar/react/multimonth';
import { EventSourceInput } from '@fullcalendar/react';

import '@fullcalendar/react/skeleton.css';
import '@fullcalendar/react/themes/forma/theme.css';
import './LargeCalendar.scss'; // Custom Forma palette
import { useTheme } from 'next-themes';
import { HTMLAttributes, ReactNode, useEffect, useState } from 'react';

import styles from './LargeCalendar.module.scss';

export type LargeCalendarClientProps = {
  locale: string;
  events: EventSourceInput;
} & HTMLAttributes<HTMLDivElement>;

const LargeCalendarClient = ({
  locale,
  events,
  ...rest
}: LargeCalendarClientProps) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, systemTheme } = useTheme();

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
      events={events}
      locale={locale}
      colorScheme={resolvedTheme ?? systemTheme}
      firstDay={1}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'today,prev,next,title',
        right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek'
      }}
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
      eventContent={renderEventContent}
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

function renderEventContent(eventInfo: EventDisplayInfo): ReactNode | null {
  const rawLocation: unknown = eventInfo.event.extendedProps['location'];
  const location: string | null =
    typeof rawLocation === 'string' ? rawLocation : null;

  return (
    <>
      <div className={eventInfo.timeClass}>{eventInfo.timeText}</div>
      <b
        className={
          eventInfo.titleClass +
          ' ' +
          (eventInfo.isInteractive ? styles.eventHoverUnderline : '') +
          ' ' +
          (location ? styles.titleWithLocation : '')
        }
      >
        {eventInfo.event.title}
      </b>
      {location && (
        <div className={eventInfo.titleClass + ' ' + styles.location}>
          {location}
        </div>
      )}
    </>
  );
}
