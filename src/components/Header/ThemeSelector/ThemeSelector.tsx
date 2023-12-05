'use client';

import { useEffect } from 'react';
import styles from './ThemeSelector.module.scss';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import React from 'react';

function ThemeSelector() {
  const [isDark, setIsDark] = React.useState(false);

  const setTheme = () => {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    setIsDark(theme === 'dark');
  };

  useEffect(() => {
    setTheme();
  }, [setTheme]);

  const toggleTheme = () => {
    const theme = getTheme();
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    window.localStorage.setItem('theme', newTheme);
    setTheme();
  };

  const getTheme = () => {
    const preference = window.localStorage.getItem('theme');
    if (preference) return preference;
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return darkQuery.matches ? 'dark' : 'light';
  };

  return (
    <a className={styles.toggle} onClick={toggleTheme}>
      {isDark ? <BsFillMoonFill /> : <BsFillSunFill />}
    </a>
  );
}

export default ThemeSelector;
