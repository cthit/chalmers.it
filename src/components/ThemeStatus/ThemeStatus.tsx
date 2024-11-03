'use client';

import i18nService from '@/services/i18nService';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeStatus = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <>
      <p>
        {l.settings.general.themeResolved} {resolvedTheme}
      </p>
      {systemTheme ? (
        <p>
          {l.settings.general.systemTheme} {systemTheme}
        </p>
      ) : (
        <p>{l.settings.general.noSystemTheme}</p>
      )}
    </>
  ) : (
    <p>{l.settings.general.resolvingTheme}</p>
  );
};

export default ThemeStatus;
