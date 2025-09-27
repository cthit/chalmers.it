'use client';

import React, { useState } from 'react';
import NewsPost from './NewsPost/NewsPost';
import NewsCard from './NewsCard/NewsCard';
import Divider from '../Divider/Divider';
import InfiniteScroller from './InfiniteScroller';
import ViewToggle from './ViewToggle';
import ActionLink from '../ActionButton/ActionLink';
import { getData } from '@/actions/newsList';
import i18nService from '@/services/i18nService';
import styles from './NewsList.module.scss';
import clientStyles from './NewsListClient.module.scss';

interface NewsClientProps {
  news: Awaited<ReturnType<typeof getData>>[];
  canPost: boolean;
  locale: string;
}

const NewsClient = ({ news, canPost, locale }: NewsClientProps) => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const l = i18nService.getLocale(locale);

  const handleViewChange = (newView: 'list' | 'grid') => {
    setView(newView);
  };

  const filteredNews = news.filter((p) => p !== undefined);

  return (
    <>
      <div className={styles.title}>
        <h1>{l.news.title}</h1>
        <div className={styles.actions}>
          <ViewToggle
            locale={locale}
            onViewChange={handleViewChange}
            initialView={view}
          />
          {canPost && <ActionLink href="/post/new">{l.news.create}</ActionLink>}
        </div>
      </div>
      <Divider />
      {news.length === 0 && (
        <>
          <p>{l.news.empty}</p>
        </>
      )}
      {news.length > 0 && (
        <>
          {view === 'grid' ? (
            <div className={clientStyles.grid}>
              {filteredNews.map((newsPost) => (
                <NewsCard key={newsPost!.id} post={newsPost!} locale={locale} />
              ))}
              <InfiniteScroller
                page={2}
                locale={locale}
                view={view}
                wrapInGrid={false}
              />
            </div>
          ) : (
            filteredNews.map((newsPost) => (
              <React.Fragment key={newsPost!.id}>
                <NewsPost locale={locale} post={newsPost!} />
              </React.Fragment>
            ))
          )}
          {view !== 'grid' && (
            <InfiniteScroller page={2} locale={locale} view={view} />
          )}
        </>
      )}
    </>
  );
};

export default NewsClient;
