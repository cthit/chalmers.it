import styles from './NewsList.module.scss';
import NewsPost from './NewsPost/NewsPost';
import SessionService from '@/services/sessionService';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import i18nService from '@/services/i18nService';
import ActionLink from '../ActionButton/ActionLink';
import React from 'react';
import { getData, getPage } from '@/actions/newsList';
import NewsClient from './NewsClient';

const NewsList = async ({ locale }: { locale: string }) => {
  try {
    const news = await getPage(1, locale);
    const canPost = await SessionService.isActive().catch(() => false);

    return <News news={news} canPost={canPost} locale={locale} />;
  } catch {
    return <NewsError locale={locale} />;
  }
};

const News = ({
  news,
  canPost,
  locale
}: {
  news: Awaited<ReturnType<typeof getData>>[];
  canPost: boolean;
  locale: string;
}) => {
  return (
    <ContentPane>
      <NewsClient news={news} canPost={canPost} locale={locale} />
    </ContentPane>
  );
};

const NewsError = ({ locale }: { locale?: string }) => {
  const l = i18nService.getLocale(locale);
  return (
    <div className={styles.list}>
      <h1>{l.news.title}</h1>
      <Divider />
      <p>{l.news.error}</p>
    </div>
  );
};

export default NewsList;
