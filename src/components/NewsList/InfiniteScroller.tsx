'use client';

import styles from './InfiniteScroller.module.scss';
import { getPage } from '@/actions/newsList';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import NewsPost from './NewsPost/NewsPost';
import i18nService from '@/services/i18nService';
import ActionButton from '../ActionButton/ActionButton';
import Divider from '../Divider/Divider';

const InfiniteScroller = ({
  page,
  locale
}: {
  page: number;
  locale: string;
}) => {
  const [news, setNews] = useState<any[] | undefined>(undefined);
  const ref = useRef<HTMLParagraphElement | null>(null);

  const l = i18nService.getLocale(locale);

  const getNext = useCallback(() => {
    getPage(page, locale).then((news) => {
      setNews(news);
    });
  }, [locale, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        getNext();
      }
    });

    if (news !== undefined) {
      observer.disconnect();
      return;
    }

    if (ref.current) {
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref, locale, page, getNext, news]);

  return (
    <>
      {news === undefined ? (
        <>
          <ActionButton onClick={getNext} className={styles.loadButton}>
            {l.news.loadMore}
          </ActionButton>
          <p className={`${styles.loading} ${styles.hitBox}`} ref={ref}>
            {l.news.loading}
          </p>
        </>
      ) : (
        <>
          {news.map((post: any) => (
            <React.Fragment key={post.id}>
              <Divider />
              <NewsPost key={post.id} post={post} locale={locale} />
            </React.Fragment>
          ))}
          {news.length > 0 ? (
            <InfiniteScroller page={page + 1} locale={locale} />
          ) : (
            <p className={styles.loading}>{l.news.loadEmpty}</p>
          )}
        </>
      )}
    </>
  );
};

export default InfiniteScroller;
