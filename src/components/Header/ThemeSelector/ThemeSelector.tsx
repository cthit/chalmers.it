'use client';

import styles from './ThemeSelector.module.scss';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useTheme } from 'next-themes';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const systemTheme = window
    ? window.matchMedia('(prefers-color-scheme: dark)')
      ? 'dark'
      : 'light'
    : undefined;

  const isDark = (theme || systemTheme) === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <a className={styles.toggle} onClick={toggleTheme}>
      {isDark ? <BsFillMoonFill /> : <BsFillSunFill />}
    </a>
  );
};

export default ThemeSelector;
