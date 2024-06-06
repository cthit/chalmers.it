'use client';

import styles from './ThemeSelector.module.scss';
import { BsFillSunFill, BsFillMoonFill, BsThreeDots } from 'react-icons/bs';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const ThemeSelector = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${styles.icon} ${styles.loading}`}>
        <BsThreeDots />
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <a className={`${styles.icon} ${styles.toggle}`} onClick={toggleTheme}>
      {isDark ? <BsFillMoonFill /> : <BsFillSunFill />}
    </a>
  );
};

export default ThemeSelector;
