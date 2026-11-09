import i18nService from '@/services/i18nService';
import styles from './EventLanguageIndicator.module.scss';
import { EventLanguage } from '@prisma/client';
import EventLanguageIcon from './EventLanguageIcon/EventLanguageIcon';
import { joinSentence } from '@/utils/strings';

const EventLanguageIndicator = ({
  locale,
  language,
  className,
  iconOnly,
  plural
}: {
  locale: string;
  language: EventLanguage | EventLanguage[];
  className?: string;
  iconOnly?: boolean;
  plural?: boolean;
}) => {
  const l = i18nService.getLocale(locale);

  const languages = Array.isArray(language) ? language : [language];

  const languageName: Record<EventLanguage, string> = {
    SV: l.events.languages.sv,
    EN: l.events.languages.en,
    SV_EN: l.events.languages.sv_en
  };

  const altText =
    (plural || languages.length > 1
      ? l.events.eventsHeldInLanguage
      : l.events.eventHeldInLanguage) +
    ' ' +
    joinSentence(
      languages.map((lang) => languageName[lang]),
      l.events.asWellAsIn
    );

  return (
    <div className={styles.container + ' ' + (className ?? '')}>
      {languages.map((lang) => (
        <EventLanguageIcon
          key={lang}
          language={lang}
          tooltip={iconOnly ? altText : undefined}
        />
      ))}
      <p className={iconOnly ? styles.screenReaderOnly : ''}>{altText}</p>
    </div>
  );
};

export default EventLanguageIndicator;
