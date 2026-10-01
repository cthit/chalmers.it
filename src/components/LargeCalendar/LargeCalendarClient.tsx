'use client';

import FullCalendar from '@fullcalendar/react';
import themePlugin from '@fullcalendar/react/themes/forma'
import dayGridPlugin from '@fullcalendar/react/daygrid';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import listPlugin from '@fullcalendar/react/list';
import multiMonthPlugin from '@fullcalendar/react/multimonth';
import { EventSourceInput } from '@fullcalendar/react';

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/forma/theme.css'
import '@fullcalendar/react/themes/forma/palettes/blue.css'
import { useTheme } from 'next-themes';

const LargeCalendarClient = ({
  locale,
  events
}: {
  locale: string;
  events: EventSourceInput;
}) => {
  const { resolvedTheme, systemTheme } = useTheme();

  return (
    <FullCalendar
      plugins={[themePlugin, dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin]}
      events={events}
      locale={locale}
      colorScheme={resolvedTheme ?? systemTheme}
      firstDay={1}
      initialView="timeGridWeek"
      headerToolbar={{ left: "today,prev,next,title", right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek' }}
    />
  );
};

export default LargeCalendarClient;
