import i18nService from '@/services/i18nService';
import styles from './EventLanguageIndicator.module.scss';
import { EventLanguage } from '@prisma/client';
import EventLanguageIcon from './EventLanguageIcon/EventLanguageIcon';

const EventLanguageIndicator = ({
  locale,
  language,
  className,
  iconOnly,
  plural
}: {
  locale: string;
  language: EventLanguage;
  className?: string;
  iconOnly?: boolean;
  plural?: boolean;
}) => {
  const l = i18nService.getLocale(locale);

  const languageName = (
    {
      SV: l.events.languages.sv,
      EN: l.events.languages.en,
      SV_EN: l.events.languages.sv_en
    } satisfies Record<EventLanguage, string>
  )[language];

  const altText =
    (plural ? l.events.eventsHeldInLanguage : l.events.eventHeldInLanguage) +
    ' ' +
    languageName;

  return (
    <div className={styles.container + ' ' + (className ?? '')}>
      <EventLanguageIcon
        language={language}
        tooltip={iconOnly ? altText : undefined}
      />
      <p className={iconOnly ? styles.screenReaderOnly : ''}>{altText}</p>
    </div>
  );
};

export default EventLanguageIndicator;
