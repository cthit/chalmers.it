import i18nService from '@/services/i18nService';
import Link from 'next/link';
import { FaRss } from 'react-icons/fa';
import styles from './RssFeedButton.module.scss';

interface RssFeedButtonProps {
  locale: string;
}

const RssFeedButton = ({ locale }: RssFeedButtonProps) => {
  const l = i18nService.getLocale(locale);

  return (
    <Link
      href={`/api/news?format=rss&locale=${locale}`}
      aria-label={l.news.subscribe}
      className={styles.button}
      title={l.news.subscribe}
      target='_blank'
      rel='noopener noreferrer'
    >
      <FaRss />
    </Link>
  );
};

export default RssFeedButton;
