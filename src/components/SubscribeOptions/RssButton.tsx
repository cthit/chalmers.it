'use client';

import { useRef, useState } from 'react';
import { FaRss } from 'react-icons/fa';
import styles from './SubscribeOptions.module.scss';

interface RssButtonProps {
  rssUrl: string;
  label: string;
  tooltipText: string;
}

export default function RssButton({
  rssUrl,
  label,
  tooltipText
}: RssButtonProps) {
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
      window.open(rssUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button
      type="button"
      className={styles.iconButton}
      aria-label={label}
      title={label}
      onClick={handleClick}
    >
      <FaRss />
      <span
        className={
          styles.tooltip + (tooltipVisible ? ' ' + styles.tooltipVisible : '')
        }
        role="status"
        aria-live="polite"
      >
        {tooltipText}
      </span>
    </button>
  );
}
