import i18nService from '@/services/i18nService';
import styles from './SpokenLanguageIcon.module.scss';
import { Language } from '@prisma/client';

const SpokenLanguageIcon = ({
  locale,
  language,
  className
}: {
  locale: string;
  language: Language;
  className?: string;
}) => {
  const l = i18nService.getLocale(locale);

  const altText =
    (language === Language.EN ? l.events.english : l.events.swedish) + 
    ' ' +
    l.events.spokenLanguage;

  return (
    <div
    aria-label={altText}
    title={altText}
    className={styles.container + ' ' + (className ?? '')}
    >
      <picture className={styles.flag}>
        <img
          src={language === Language.EN ? '/uk.svg' : '/sweden.svg'}
          alt={altText}
        />
      </picture>
    </div>
  );
};

export default SpokenLanguageIcon;
