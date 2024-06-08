'use client';

import './Calendar.scss';
import styles from './CalendarTiles.module.scss';
import { Calendar as ReactCalendar, TileClassNameFunc } from 'react-calendar';
import React from 'react';
import Dropdown from '../Header/Navigation/Dropdown/Dropdown';
import i18nService from '@/services/i18nService';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const stripTime = (d: Date) => {
  return d.setHours(0, 0, 0, 0);
};

const CalendarClient = ({
  locale,
  events
}: {
  locale: string;
  events: {
    [key: number]: {
      id: number;
      titleSv: string;
      titleEn: string;
      descriptionEn: string;
      descriptionSv: string;
      fullDay: boolean;
      startTime: Date;
      endTime: Date;
      location: string | null;
      createdAt: Date;
      updatedAt: Date;
      newsPostId: number | null;
    }[];
  };
}) => {
  const [value, onChange] = React.useState<Value>(new Date());
  const loc = locale === 'sv' ? 'sv-SE' : 'en-US';
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  const mapTileClass: TileClassNameFunc = ({ activeStartDate, date, view }) => {
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
      tileContent={({ activeStartDate, date, view }) =>
        view === 'month' ? (
          events[stripTime(date)] ? (
            <Dropdown
              className={styles.dropdown}
              parent={<div className={styles.date}><p>{date.getDate()}</p></div>}
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
