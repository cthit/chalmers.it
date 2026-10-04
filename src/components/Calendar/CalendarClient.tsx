'use client';

import { stripTime } from '@/utils/eventDate';

import './Calendar.scss';
import styles from './CalendarTiles.module.scss';
import { Calendar as ReactCalendar, TileArgs } from 'react-calendar';
import React, { useCallback } from 'react';
import Dropdown from '../Header/Navigation/Dropdown/Dropdown';
import i18nService from '@/services/i18nService';
import ActionButton from '../ActionButton/ActionButton';
import CalendarSubscribeButtons from '../CalendarSubscribeButtons/CalendarSubscribeButtons';

type DateTileArgs = {
  date: Date;
};
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

function DateTile({ date }: DateTileArgs) {
  const classNames = `${styles.dateTile} ${styles.date} date-tile`;
  return (
    <div className={classNames}>
      <p>{date.getDate()}</p>
    </div>
  );
}

const CalendarClient = ({
  locale,
  events,
  httpBaseUrl
}: {
  locale: string;
  events: { [key: number]: any[] };
  httpBaseUrl: string;
}) => {
  const [value, onChange] = React.useState<Value>(new Date());
  const [subscribeDrawerOpen, setSubscribeDrawerOpen] =
    React.useState<boolean>(false);

  const loc = locale === 'sv' ? 'sv-SE' : 'en-US';
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  const mapTileClass = useCallback(
    ({ date }: TileArgs) => {
      const dayKey = stripTime(date);
      const todayKey = stripTime(new Date());
      return [
        styles.tile,
        ...(events[dayKey]?.length > 0 ? [styles.tileEvent] : []),
        ...(dayKey === todayKey ? [styles.today] : [])
      ];
    },
    [events]
  );

  const mapTileContent = useCallback(
    ({ date, view }: TileArgs) => {
      if (view !== 'month') {
        return null;
      }
      const classNames = `${styles.event} ${styles.dropdown}`;
      return events.hasOwnProperty(stripTime(date)) ? (
        <Dropdown
          className={styles.dropdown}
          parent={
            <div className={styles.date}>
              <DateTile date={date} />
            </div>
          }
          id={stripTime(date).toString()}
        >
          {events[stripTime(date)]?.map((event) => {
            const i18nFormat = i18nService.formatTime;
            const startTime = i18nFormat(event.startTime);
            const endTime = i18nFormat(event.endTime);
            return (
              <div key={event.id} className={classNames}>
                <h3>{en ? event.titleEn : event.titleSv}</h3>
                <p>
                  {event.fullDay
                    ? l.events.fullDay
                    : `${startTime} - ${endTime}`}
                </p>
              </div>
            );
          })}
        </Dropdown>
      ) : (
        <DateTile date={date} />
      );
    },
    [en, events, l]
  );

  return (
    <>
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
      <ActionButton
        onClick={() => setSubscribeDrawerOpen(!subscribeDrawerOpen)}
      >
        {l.events.subscribe}{' '}
        <span className={styles.drawerArrow}>
          &nbsp;{subscribeDrawerOpen ? <>&#9660;</> : <>&#9654;</>}
        </span>
      </ActionButton>
      {subscribeDrawerOpen && (
        <div className={styles.subscribeButtons}>
          <CalendarSubscribeButtons locale={locale} httpBaseUrl={httpBaseUrl} />
        </div>
      )}
    </>
  );
};

export default CalendarClient;
