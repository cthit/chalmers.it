'use client';

import { useState, useEffect } from 'react';
import styles from './ViewToggle.module.scss';
import i18nService from '@/services/i18nService';

interface ViewToggleProps {
  locale: string;
  onViewChange: (view: 'list' | 'grid') => void;
  initialView?: 'list' | 'grid';
}

const VIEW_PREFERENCE_KEY = 'newsViewPreference';

const ViewToggle = ({
  locale,
  onViewChange,
  initialView = 'list'
}: ViewToggleProps) => {
  const l = i18nService.getLocale(locale);

  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<'list' | 'grid'>(initialView);

  // On mount, sync with localStorage
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_PREFERENCE_KEY);
    if (saved === 'list' || saved === 'grid') {
      setCurrentView(saved);
      onViewChange(saved);
    } else {
      onViewChange(initialView);
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggle = (view: 'list' | 'grid') => {
    setCurrentView(view);
    onViewChange(view);
    localStorage.setItem(VIEW_PREFERENCE_KEY, view);
  };

  // Don't render until mounted on client
  if (!mounted) return null;

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={`${styles.button} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => handleToggle('list')}
        title={l.news.listView}
        aria-pressed={currentView === 'list'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2.5 3.5h11v1h-11v-1zm0 4h11v1h-11v-1zm0 4h11v1h-11v-1z" />
        </svg>
      </button>
      <button
        type="button"
        className={`${styles.button} ${currentView === 'grid' ? styles.active : ''}`}
        onClick={() => handleToggle('grid')}
        title={l.news.cardView}
        aria-pressed={currentView === 'grid'}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
