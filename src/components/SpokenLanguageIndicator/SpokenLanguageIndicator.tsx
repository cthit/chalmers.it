import i18nService from '@/services/i18nService';
import styles from './SpokenLanguageIndicator.module.scss';
import { SpokenLanguage } from '@prisma/client';
import SpokenLanguageIcon from './SpokenLanguageIcon/SpokenLanguageIcon';

const SpokenLanguageIndicator = ({
  locale,
  language,
  className,
  iconOnly
}: {
  locale: string;
  language: SpokenLanguage;
  className?: string;
  iconOnly?: boolean;
}) => {
  const l = i18nService.getLocale(locale);

  const languageName = (
    {
      SV: l.events.spokenLanguages.sv,
      EN: l.events.spokenLanguages.en,
      SV_EN: l.events.spokenLanguages.sv_en
    } satisfies Record<SpokenLanguage, string>
  )[language];

  const altText = l.events.spokenLanguages.prefix + ' ' + languageName;

  return (
    <div className={styles.container + ' ' + (className ?? '')}>
      <SpokenLanguageIcon
        language={language}
        tooltip={iconOnly ? altText : undefined}
      />
      <p className={iconOnly ? styles.screenReaderOnly : ''}>{altText}</p>
    </div>
  );
};

export default SpokenLanguageIndicator;
