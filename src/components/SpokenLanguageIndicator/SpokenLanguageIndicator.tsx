import i18nService from '@/services/i18nService';
import styles from './SpokenLanguageIndicator.module.scss';
import { SpokenLanguage } from '@prisma/client';
import SpokenLanguageIcon from './SpokenLanguageIcon/SpokenLanguageIcon';

const SpokenLanguageIndicator = ({
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

  return (
    <div className={styles.container + ' ' + (className ?? '')}>
      <SpokenLanguageIcon language={language} tooltip={altText} />
      <p>{altText}</p>
    </div>
  );
};

export default SpokenLanguageIndicator;
