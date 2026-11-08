import { SpokenLanguage } from '@prisma/client';
import styles from './SpokenLanguageIcon.module.scss';

const SpokenLanguageIcon = ({
  language,
  tooltip
}: {
  language: SpokenLanguage;
  tooltip?: string;
}) => {
  const svgPath = '/spoken-language.svg';
  const spriteIds: Record<SpokenLanguage, string> = {
    SV: 'sv',
    EN: 'en',
    SV_EN: 'sv_en'
  };
  return (
    <div title={tooltip} className={styles.container}>
      <svg>
        <use
          href={svgPath + '#main'}
          width="100%"
          height="100%"
          className={styles.icon}
        ></use>
        <use
          href={svgPath + '#' + spriteIds[language]}
          width="100%"
          height="100%"
        ></use>
      </svg>
    </div>
  );
};

export default SpokenLanguageIcon;
