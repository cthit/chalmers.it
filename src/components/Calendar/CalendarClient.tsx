'use client';

import './Calendar.scss';
import styles from './CalendarTiles.module.scss';
import { Calendar as ReactCalendar, TileArgs } from 'react-calendar';
import React, { useCallback } from 'react';
import Dropdown from '../Header/Navigation/Dropdown/Dropdown';
import i18nService from '@/services/i18nService';
import EventService from '@/services/eventService';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarClient = ({
  locale,
  events
}: {
  locale: string;
  events: { [key: number]: any[] };
}) => {
  const [value, onChange] = React.useState<Value>(new Date());

  const loc = locale === 'sv' ? 'sv-SE' : 'en-US';
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  const mapTileClass = useCallback(
    ({ date }: TileArgs) => {
      return [
        styles.tile,
        ...((events[EventService.stripTime(date)] || []).length > 0
          ? [styles.tileEvent]
          : [])
      ];
    },
    [events]
  );

  const mapTileContent = useCallback(
    ({ date, view }: TileArgs) => {
      if (view !== 'month') {
        return null;
      }
      return events.hasOwnProperty(EventService.stripTime(date)) ? (
        <Dropdown
          className={styles.dropdown}
          parent={
            <div className={styles.date}>
              <p>{date.getDate()}</p>
            </div>
          }
          id={EventService.stripTime(date).toString()}
        >
          {events[EventService.stripTime(date)]?.map((event) => (
            <div key={event.id} className={styles.event}>
              <h3>{en ? event.titleEn : event.titleSv}</h3>
              <p>
                {event.fullDay
                  ? l.events.fullDay
                  : `${i18nService.formatTime(event.startTime)} - ${i18nService.formatTime(event.endTime)}`}
              </p>
            </div>
          ))}
        </Dropdown>
      ) : (
        <p>{date.getDate()}</p>
      );
    },
    [en, events, l]
  );

  return (
    <ReactCalendar
      locale={loc}
      maxDetail="month"
      minDetail="decade"
      onChange={onChange}
      value={value}
      className="event-calendar"
      tileClassName={mapTileClass}
      calendarType="iso8601"
      tileContent={mapTileContent}
    />
  );
};

export default CalendarClient;
