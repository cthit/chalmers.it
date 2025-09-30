'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './LanguageToggle.module.scss';
import i18nService from '@/services/i18nService';

type Lang = 'sv' | 'en';

interface Props {
  locale?: string;
  onLocaleChange?: (locale: Lang) => void;
}

const LanguageToggle = ({ locale, onLocaleChange }: Props) => {
  const router = useRouter();
  const currentPathname = usePathname();

  const detectLocaleFromPath = (p: string) =>
    p === '/en' || p.startsWith('/en/') ? 'en' : 'sv';

  const [currentLocale, setCurrentLocale] = useState<Lang>(() => {
    if (locale) return locale.startsWith('en') ? 'en' : 'sv';
    return detectLocaleFromPath(currentPathname);
  });

  useEffect(() => {
    const detected = locale
      ? locale.startsWith('en')
        ? 'en'
        : 'sv'
      : detectLocaleFromPath(currentPathname);
    setCurrentLocale(detected);
  }, [currentPathname, locale]);

  const handleToggle = () => {
    const next: Lang = currentLocale === 'en' ? 'sv' : 'en';
    setCurrentLocale(next);
    if (onLocaleChange) onLocaleChange(next);

    if (currentPathname.startsWith('/en')) {
      router.push(currentPathname.replace(`/en`, `/sv`));
    } else {
      router.push(`/en${currentPathname}`);
    }
  };

  return (
    <div className={styles.toggle}>
      <a
        className={styles.button}
        onClick={(e) => {
          e.preventDefault();
          handleToggle();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <picture className={styles.flag}>
          <img
            src={currentLocale === 'en' ? '/uk.svg' : '/sweden.svg'}
            alt={
              currentLocale === 'en' ? 'Switch to Swedish' : 'Switch to English'
            }
          />
        </picture>
        <p>{currentLocale === 'en' ? 'EN' : 'SV'}</p>
      </a>
    </div>
  );
};

export default LanguageToggle;
