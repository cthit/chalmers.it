import styles from './NewsPostMeta.module.scss';
import i18nService from '@/services/i18nService';
import { PostStatus } from '@prisma/client';

const NewsPostMeta = ({
  post,
  locale
}: {
  post: {
    author?: string;
    createdAt: Date;
    updatedAt?: Date;
    status: PostStatus;
    writtenFor?: string;
  };
  locale: string;
}) => {
  const l = i18nService.getLocale(locale);
  return (
    <p className={styles.subtitle}>
      {post.status === PostStatus.SCHEDULED ? `${l.news.scheduled} ` : null}
      {`${i18nService.formatDate(post.createdAt)} | ${l.news.written} `}
      {post.writtenFor && `${l.news.for} ${post.writtenFor}`}{' '}
      {`${l.news.by} ${post.author ?? l.news.unknown} `}
      {post.updatedAt &&
        ` | ${l.news.edited} ${i18nService.formatDate(post.updatedAt)}`}
    </p>
  );
};

export default NewsPostMeta;
