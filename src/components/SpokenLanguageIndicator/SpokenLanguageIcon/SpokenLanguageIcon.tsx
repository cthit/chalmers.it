import { SpokenLanguage } from '@prisma/client';
import styles from './SpokenLanguageIcon.module.scss';
import { ReactNode } from 'react';
import SpokenEn from './icons/SpokenEn';
import SpokenOther from './icons/SpokenOther';
import SpokenSvEn from './icons/SpokenSvEn';
import SpokenSv from './icons/SpokenSv';

const SpokenLanguageIcon = ({
  language,
  tooltip
}: {
  language: SpokenLanguage;
  tooltip?: string;
}) => {
  const images: Record<SpokenLanguage, ReactNode> = {
    SV: <SpokenSv aria-hidden={true} />,
    EN: <SpokenEn aria-hidden={true} />,
    SV_EN: <SpokenSvEn aria-hidden={true} />,
    OTHER: <SpokenOther aria-hidden={true} />
  };
  return (
    <div title={tooltip} className={styles.flag}>
      {images[language]}
    </div>
  );
};

export default SpokenLanguageIcon;
