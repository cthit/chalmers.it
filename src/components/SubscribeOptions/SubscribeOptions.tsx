import i18nService from '@/services/i18nService';
import Link from 'next/link';
import { MdEmail } from 'react-icons/md';
import { SiSlack } from 'react-icons/si';
import ContentPane from '../ContentPane/ContentPane';
import RssButton from './RssButton';
import styles from './SubscribeOptions.module.scss';
import getSlackSubscribeLink from '@/hooks/getSlackSubscribeLink';

interface SubscribeOptionsProps {
  locale: string;
}

export default async function SubscribeOptions({
  locale
}: SubscribeOptionsProps) {
  const l = i18nService.getLocale(locale);
  const slackSubscribeUrl = await getSlackSubscribeLink();

  return (
    <ContentPane>
      <h2 className={styles.title}>{l.news.subscribe}</h2>
      <div className={styles.optionsContainer}>
        {slackSubscribeUrl && (
          <Link
            href={slackSubscribeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.iconButton}
            title={l.news.subscribeViaSlack}
            aria-label={l.news.subscribeViaSlack}
          >
            <SiSlack />
          </Link>
        )}

        <button
          type="button"
          className={styles.iconButton}
          title={l.general.comingSoon}
          aria-label={l.general.comingSoon}
          disabled
        >
          <MdEmail />
        </button>

        <RssButton
          rssUrl={`/api/news?format=rss&locale=${locale}`}
          label={l.news.subscribeViaRss}
          tooltipText={l.editor.linkCopied}
        />
      </div>
    </ContentPane>
  );
}
