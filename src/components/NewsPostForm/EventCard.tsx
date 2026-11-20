'use client';

import { EventLanguage } from '@prisma/client';
import { capitalize } from '@/utils/strings';
import i18nService from '@/services/i18nService';
import ActionButton from '@/components/ActionButton/ActionButton';
import TextArea from '@/components/TextArea/TextArea';
import DropdownList from '../DropdownList/DropdownList';
import DatePicker, {
  convertToDateTimeLocalString
} from '../DatePicker/DatePicker';
import { useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import style from './EventCard.module.scss';
import { getEventKey } from './eventDraft';
import type { PostEvent } from './eventDraft';

interface EventCardProps {
  event: PostEvent;
  locale: string;
  languageLabel: (language: 'en' | 'sv') => string;
  onChange: <K extends keyof PostEvent>(key: K, value: PostEvent[K]) => void;
  onDateChange: (key: 'startTime' | 'endTime', value: Date) => void;
  onRemove: () => void;
}

const EventField = ({
  id,
  label,
  children
}: {
  id: string;
  label: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className={style.eventField}>
    <label className={style.eventLabel} htmlFor={id}>
      {label}
    </label>
    {children}
  </div>
);

const EventCard = ({
  event,
  locale,
  languageLabel,
  onChange,
  onDateChange,
  onRemove
}: EventCardProps) => {
  const l = i18nService.getLocale(locale);
  const [isOpen, setIsOpen] = useState(event.id === undefined);
  const eventKey = getEventKey(event);
  const title =
    (locale === 'en' ? event.titleEn : event.titleSv) ||
    event.titleEn ||
    event.titleSv ||
    l.events.untitled;

  return (
    <details
      className={style.eventCard}
      open={isOpen}
      onToggle={(ev) => setIsOpen(ev.currentTarget.open)}
    >
      <summary className={style.eventSummary}>
        <span className={style.eventSummaryContent}>
          <span className={style.eventTitle} role="heading" aria-level={3}>
            {title}
          </span>
          <span className={style.eventDate}>
            {i18nService.formatDate(event.startTime)}
          </span>
        </span>
      </summary>
      <div className={style.eventBody}>
        <EventField
          id={`event-title-en-${eventKey}`}
          label={`${l.editor.title} (${languageLabel('en')})`}
        >
          <TextArea
            id={`event-title-en-${eventKey}`}
            value={event.titleEn}
            onChange={(ev) => onChange('titleEn', ev.target.value)}
            required
          />
        </EventField>
        <EventField
          id={`event-title-sv-${eventKey}`}
          label={`${l.editor.title} (${languageLabel('sv')})`}
        >
          <TextArea
            id={`event-title-sv-${eventKey}`}
            value={event.titleSv}
            onChange={(ev) => onChange('titleSv', ev.target.value)}
            required
          />
        </EventField>
        <EventField id={`event-start-${eventKey}`} label={l.events.start}>
          <DatePicker
            id={`event-start-${eventKey}`}
            required
            value={event.startTime}
            onChange={(date) => onDateChange('startTime', date)}
          />
        </EventField>
        <EventField id={`event-end-${eventKey}`} label={l.events.end}>
          <DatePicker
            id={`event-end-${eventKey}`}
            disabled={event.fullDay}
            required
            value={event.endTime}
            min={
              event.startTime
                ? convertToDateTimeLocalString(event.startTime)
                : undefined
            }
            onChange={(date) => onDateChange('endTime', date)}
          />
        </EventField>
        <label
          className={style.eventCheckbox}
          htmlFor={`event-full-day-${eventKey}`}
        >
          <input
            type="checkbox"
            id={`event-full-day-${eventKey}`}
            checked={event.fullDay}
            onChange={(ev) => onChange('fullDay', ev.target.checked)}
          />
          {l.events.fullDay}
        </label>
        <EventField
          id={`event-location-${eventKey}`}
          label={l.events.location}
        >
          <TextArea
            id={`event-location-${eventKey}`}
            value={event.location ?? ''}
            onChange={(ev) => onChange('location', ev.target.value)}
          />
        </EventField>
        <EventField
          id={`event-language-${eventKey}`}
          label={l.events.language}
        >
          <DropdownList
            id={`event-language-${eventKey}`}
            value={event.language?.toString() ?? ''}
            onChange={(ev) =>
              onChange(
                'language',
                ev.target.value === ''
                  ? null
                  : EventLanguage[ev.target.value as EventLanguage]
              )
            }
          >
            <option value="">{l.general.notApplicable}</option>
            <option value="SV">{capitalize(l.events.languages.sv)}</option>
            <option value="EN">{capitalize(l.events.languages.en)}</option>
            <option value="SV_EN">
              {capitalize(l.events.languages.sv_en)}
            </option>
          </DropdownList>
        </EventField>
      </div>
      <div className={style.eventFooter}>
        <ActionButton
          type="button"
          variant="secondary"
          aria-label={l.events.remove}
          title={l.events.remove}
          onClick={onRemove}
        >
          <BsTrash />
        </ActionButton>
      </div>
    </details>
  );
};

export default EventCard;
