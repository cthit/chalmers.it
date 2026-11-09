import { EventLanguage } from '@prisma/client';
import styles from './EventLanguageIcon.module.scss';

const EventLanguageIcon = ({
  language,
  tooltip
}: {
  language: EventLanguage;
  tooltip?: string;
}) => {
  const svgPath = '/language-speech-bubble.svg';
  const spriteIds: Record<EventLanguage, string> = {
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

export default EventLanguageIcon;
