import i18nService from '@/services/i18nService';
import styles from './SpokenLanguageIndicator.module.scss';
import { SpokenLanguage } from '@prisma/client';

const SpokenLanguageIcon = ({
  locale,
  language,
  className
}: {
  locale: string;
  language: SpokenLanguage;
  className?: string;
}) => {
  const l = i18nService.getLocale(locale);

  const languageName = (
    {
      SV: l.events.spokenLanguages.sv,
      EN: l.events.spokenLanguages.en,
      SV_EN: l.events.spokenLanguages.sv_en,
      OTHER: l.events.spokenLanguages.other
    } satisfies Record<SpokenLanguage, string>
  )[language];

  const altText = languageName + ' ' + l.events.spokenLanguages.suffix;

  const images: Record<SpokenLanguage, string> = {
    EN: '/spoken-en.svg',
    SV: '/spoken-sv.svg',
    SV_EN: '/spoken-sv-en.svg',
    OTHER: '/spoken-other.svg'
  };

  return (
    <div className={styles.container + ' ' + (className ?? '')}>
      <picture aria-label={altText} title={altText} className={styles.flag}>
        <img src={images[language]} alt={altText} />
      </picture>
      <p>{altText}</p>
    </div>
  );
};

export default SpokenLanguageIcon;
