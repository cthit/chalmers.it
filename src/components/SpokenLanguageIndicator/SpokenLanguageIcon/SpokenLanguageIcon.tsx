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
    SV: <SpokenSv />,
    EN: <SpokenEn />,
    SV_EN: <SpokenSvEn />,
    OTHER: <SpokenOther />
  };
  return (
    <picture aria-label={tooltip} title={tooltip} className={styles.flag}>
      {images[language]}
    </picture>
  );
};

export default SpokenLanguageIcon;
