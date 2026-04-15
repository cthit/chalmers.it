'use client';

import i18nService from '@/services/i18nService';
import { FaRss } from 'react-icons/fa';
import styles from './RssFeedButton.module.scss';

interface RssFeedButtonProps {
  locale: string;
}

const RssFeedButton = ({ locale }: RssFeedButtonProps) => {
  const l = i18nService.getLocale(locale);

  return (
    <a
      href={`/api/news?format=rss&locale=${locale}`}
      aria-label={l.news.subscribe}
      className={styles.button}
      title={l.news.subscribe}
      target='_blank'
      rel='noopener noreferrer'
    >
      <FaRss />
    </a>
  );
};

export default RssFeedButton;
