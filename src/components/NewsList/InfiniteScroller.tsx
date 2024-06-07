'use client';

import styles from './InfiniteScroller.module.scss';
import { getPage } from '@/actions/newsList';
import { useEffect, useRef, useState } from 'react';
import NewsPost from './NewsPost/NewsPost';

const InfiniteScroller = ({
  page,
  locale
}: {
  page: number;
  locale: string;
}) => {
  const [news, setNews] = useState<any[] | undefined>(undefined);
  const ref = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        getPage(page, locale).then((news) => {
          setNews(news);
        });
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [ref]);

  return (
    <>
      {news === undefined ? (
        <p className={styles.loading} ref={ref}>
          Loading posts
        </p>
      ) : (
        <>
          {news.map((post: any) => (
            <NewsPost key={post.id} post={post} locale={locale} />
          ))}
          {news.length > 0 ? (
            <InfiniteScroller page={page + 1} locale={locale} />
          ) : (
            <p className={styles.loading}>No more posts to show.</p>
          )}
        </>
      )}
    </>
  );
};

export default InfiniteScroller;
