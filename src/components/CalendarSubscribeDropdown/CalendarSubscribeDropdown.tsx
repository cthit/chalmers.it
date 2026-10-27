'use client';

import i18nService from '@/services/i18nService';
import ActionButton from '../ActionButton/ActionButton';
import React from 'react';
import CalendarSubscribeButtons from '../CalendarSubscribeButtons/CalendarSubscribeButtons';
import styles from './CalendarSubscribeDropdown.module.scss';

const CalendarSubscribeDropdown = ({
  locale,
  httpBaseUrl,
  ...rest
}: {
  locale: string;
  httpBaseUrl: string;
  className?: string;
}) => {
  const l = i18nService.getLocale(locale);

  const [isOpen, setOpen] = React.useState<boolean>(false);

  return (
    <div {...rest}>
      <ActionButton
        className={styles.drawerButton}
        onClick={() => setOpen(!isOpen)}
      >
        {l.events.subscribe}{' '}
        <span className={styles.drawerArrow}>
          &nbsp;{isOpen ? <>&#9660;</> : <>&#9654;</>}
        </span>
      </ActionButton>
      {isOpen && (
        <div className={styles.subscribeButtons}>
          <CalendarSubscribeButtons locale={locale} httpBaseUrl={httpBaseUrl} />
        </div>
      )}
    </div>
  );
};

export default CalendarSubscribeDropdown;
