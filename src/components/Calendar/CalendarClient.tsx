'use client';

import './Calendar.scss';
import styles from './CalendarTiles.module.scss';
import { Calendar as ReactCalendar, TileClassNameFunc } from 'react-calendar';
import React, { useEffect } from 'react';
import Dropdown from '../Header/Navigation/Dropdown/Dropdown';
import i18nService from '@/services/i18nService';
import { getAllEvents } from '@/actions/events';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const stripTime = (d: Date) => {
  return d.setHours(0, 0, 0, 0);
};

const CalendarClient = ({ locale }: { locale: string }) => {
  const [value, onChange] = React.useState<Value>(new Date());
  const [events, setEvents] = React.useState<{ [key: number]: any[] }>({});

  const loc = locale === 'sv' ? 'sv-SE' : 'en-US';
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  useEffect(() => {
    const getEvents = async () => {
      setEvents(await getAllEvents());
    };

    getEvents();
  }, []);

  const mapTileClass: TileClassNameFunc = ({ date }) => {
    return [
      styles.tile,
      ...((events[stripTime(date)] || []).length > 0 ? [styles.tileEvent] : [])
    ];
  };

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
      tileContent={({ date, view }) =>
        view === 'month' ? (
          events[stripTime(date)] ? (
            <Dropdown
              className={styles.dropdown}
              parent={
                <div className={styles.date}>
                  <p>{date.getDate()}</p>
                </div>
              }
              id={stripTime(date).toString()}
            >
              {events[stripTime(date)]?.map((event) => (
                <div key={event.id} className={styles.event}>
                  <h3>{en ? event.titleEn : event.titleSv}</h3>
                  <p>{event.fullDay ? l.events.fullDay : 'Time'}</p>
                </div>
              ))}
            </Dropdown>
          ) : (
            <p>{date.getDate()}</p>
          )
        ) : null
      }
    />
  );
};

export default CalendarClient;
