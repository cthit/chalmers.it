import i18nService from '@/services/i18nService';
import ActionLink from '../ActionButton/ActionLink';
import React from 'react';
import styles from './CalendarSubscribeButtons.module.scss';
import CopyButton from './CopyButton/CopyButton';

type SubscribeOption = {
  name: string;
  href: string;
};

const CalendarSubscribeButtons = ({
  locale,
  relativeUrl,
  calendarName,
  ...rest
}: {
  locale: string;
  relativeUrl?: string;
  calendarName?: string;
} & React.ComponentProps<'ul'>) => {
  const l = i18nService.getLocale(locale);

  if (relativeUrl === undefined) {
    relativeUrl = `/api/events?format=ical&locale=${locale}`;
  }
  if (calendarName === undefined) {
    calendarName = l.events.calendarName;
  }

  const clientBaseUrl =
    typeof document !== 'undefined'
      ? document.location.protocol + '//' + document.location.host
      : undefined;
  const httpBaseUrl =
    process.env.BASE_URL || clientBaseUrl || 'https://chalmers.it';
  const httpUrl = new URL(relativeUrl, httpBaseUrl).href;
  const webcalBaseUrl = httpUrl.replace(/^https?/, 'webcal');
  const webcalUrl = httpUrl.replace(/^https?/, 'webcal');

  const options: SubscribeOption[] = [
    {
      name: l.events.services.googleCalendar,
      href: `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(webcalUrl)}`
    },
    {
      name: l.events.services.appleCalendar,
      href: webcalUrl
    },
    {
      name: l.events.services.outlook,
      href: `https://outlook.office.com/calendar/0/addcalendar?url=${encodeURIComponent(httpUrl)}&name=${encodeURIComponent(calendarName)}`
    }
  ];

  return (
    <ul className={styles.list} {...rest}>
      {options.map((option, i) => {
        const isExternal =
          !option.href.startsWith(httpBaseUrl) &&
          !option.href.startsWith(webcalBaseUrl);

        return (
          <li className={styles.listItem} key={i}>
            <ActionLink className={styles.link} href={option.href}>
              {option.name} {isExternal && <>&#8599;</>}
            </ActionLink>
          </li>
        );
      })}
      <CopyButton locale={locale} href={httpUrl} />
    </ul>
  );
};

export default CalendarSubscribeButtons;
