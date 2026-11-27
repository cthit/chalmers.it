'use client';

import { useState, useEffect } from 'react';
import styles from './ViewToggle.module.scss';
import i18nService from '@/services/i18nService';
import SegmentedControl from '@/components/SegmentedControl/SegmentedControl';

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
  }, []);

  const handleToggle = (view: 'list' | 'grid') => {
    setCurrentView(view);
    onViewChange(view);
    localStorage.setItem(VIEW_PREFERENCE_KEY, view);
  };

  // Don't render until mounted on client
  if (!mounted) return null;

  return (
    <SegmentedControl
      value={currentView}
      ariaLabel={l.news.viewMode}
      className={styles.toggle}
      buttonClassName={styles.button}
      options={[
        {
          value: 'list',
          label: (
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h12v2H2z" />
            </svg>
          ),
          title: l.news.listView,
          ariaLabel: l.news.listView
        },
        {
          value: 'grid',
          label: (
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" />
            </svg>
          ),
          title: l.news.cardView,
          ariaLabel: l.news.cardView
        }
      ]}
      onChange={(view) => handleToggle(view as 'list' | 'grid')}
    />
  );
};

export default ViewToggle;
