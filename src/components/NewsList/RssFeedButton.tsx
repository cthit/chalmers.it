'use client';
import i18nService from '@/services/i18nService';
import { useRef, useState } from 'react';
import { FaRss } from 'react-icons/fa';
import styles from './RssFeedButton.module.scss';

interface RssFeedButtonProps {
  locale: string;
}

export default function RssFeedButton({ locale }: RssFeedButtonProps) {
  const l = i18nService.getLocale(locale);
  const rssUrl = `/api/news?format=rss&locale=${locale}`;

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(window.location.origin + rssUrl);
      setTooltipVisible(true);
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = setTimeout(() => setTooltipVisible(false), 1500);
    } catch {
      // Fallback: open in new tab
      window.open(rssUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      type="button"
      aria-label={l.news.subscribe}
      className={styles.button}
      title={l.news.subscribe}
      onClick={handleClick}
      style={{ position: 'relative' }}
    >
      <FaRss />
      <span
        className={
          styles.tooltip + (tooltipVisible ? ' ' + styles.tooltipVisible : '')
        }
        role="status"
        aria-live="polite"
      >
        {l.editor.linkCopied}
      </span>
    </button>
  );
}
