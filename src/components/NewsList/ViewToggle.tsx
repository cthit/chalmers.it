'use client';

import { useState } from 'react';
import styles from './ViewToggle.module.scss';
import i18nService from '@/services/i18nService';

interface ViewToggleProps {
  locale: string;
  onViewChange: (view: 'list' | 'grid') => void;
  initialView?: 'list' | 'grid';
}

const ViewToggle = ({
  locale,
  onViewChange,
  initialView = 'list'
}: ViewToggleProps) => {
  const [currentView, setCurrentView] = useState<'list' | 'grid'>(initialView);
  const l = i18nService.getLocale(locale);

  const handleToggle = (view: 'list' | 'grid') => {
    setCurrentView(view);
    onViewChange(view);
  };

  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.button} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => handleToggle('list')}
        title={l.news.listView}
        aria-label={l.news.listView}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2.5 3.5h11v1h-11v-1zm0 4h11v1h-11v-1zm0 4h11v1h-11v-1z" />
        </svg>
      </button>
      <button
        className={`${styles.button} ${currentView === 'grid' ? styles.active : ''}`}
        onClick={() => handleToggle('grid')}
        title={l.news.cardView}
        aria-label={l.news.cardView}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" />
        </svg>
      </button>
    </div>
  );
};

export default ViewToggle;
