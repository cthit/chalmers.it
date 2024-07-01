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
    scheduledPublish?: Date;
    status: PostStatus;
    writtenFor?: string;
  };
  locale: string;
}) => {
  const l = i18nService.getLocale(locale);
  const scheduled = post.status === PostStatus.SCHEDULED;
  const date = scheduled
    ? post.scheduledPublish ?? post.createdAt
    : post.createdAt;
  return (
    <p className={styles.subtitle}>
      {scheduled ? `${l.news.scheduled} ` : null}
      {`${i18nService.formatDate(date)} | ${l.news.written} `}
      {post.writtenFor && `${l.news.for} ${post.writtenFor}`}{' '}
      {`${l.news.by} ${post.author ?? l.news.unknown} `}
      {post.updatedAt &&
        ` | ${l.news.edited} ${i18nService.formatDate(post.updatedAt)}`}
    </p>
  );
};

export default NewsPostMeta;
