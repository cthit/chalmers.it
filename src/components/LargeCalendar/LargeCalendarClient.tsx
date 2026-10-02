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
import { HTMLAttributes, ReactNode } from 'react';

export type LargeCalendarClientProps = {
  locale: string;
  events: EventSourceInput;
} & HTMLAttributes<HTMLDivElement>;

const LargeCalendarClient = ({
  locale,
  events,
  ...rest
}: LargeCalendarClientProps) => {
  const { resolvedTheme, systemTheme } = useTheme();

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
      eventContent={renderEventContent}
      {...rest}
    />
  );
};

export default LargeCalendarClient;

function renderEventContent(eventInfo: EventDisplayInfo): ReactNode | null {
  return (
    <>
      <div className={eventInfo.timeClass}>{eventInfo.timeText}</div>
      <b className={eventInfo.titleClass}>{eventInfo.event.title}</b>
      {eventInfo.view.type === 'timeGridDay' && (
        <div className={eventInfo.titleClass}>Hubben 2.2</div>
      )}
    </>
  );
}
