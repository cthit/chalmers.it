import { SpokenLanguage } from '@prisma/client';
import styles from './SpokenLanguageIcon.module.scss';
import { ReactNode } from 'react';
import SpokenEnIcon from './icons/SpokenEnIcon';
import SpokenOtherIcon from './icons/SpokenOtherIcon';
import SpokenSvEnIcon from './icons/SpokenSvEnIcon';
import SpokenSvIcon from './icons/SpokenSvIcon';

const SpokenLanguageIcon = ({
  language,
  tooltip
}: {
  language: SpokenLanguage;
  tooltip?: string;
}) => {
  const images: Record<SpokenLanguage, ReactNode> = {
    SV: <SpokenSvIcon />,
    EN: <SpokenEnIcon />,
    SV_EN: <SpokenSvEnIcon />,
    OTHER: <SpokenOtherIcon />
  };
  return (
    <picture aria-label={tooltip} title={tooltip} className={styles.flag}>
      {images[language]}
    </picture>
  );
};

export default SpokenLanguageIcon;
