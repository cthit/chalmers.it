import { getData } from '@/actions/newsList';
import styles from './NewsPostMeta.module.scss';
import i18nService from '@/services/i18nService';
import { PostStatus } from '@prisma/client';
import Link from 'next/link';

const NewsPostMeta = ({
  post,
  locale
}: {
  post: Exclude<Awaited<ReturnType<typeof getData>>, undefined>;
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
      {post.writtenFor && (
        <>
          {l.news.for}{' '}
          <Link href={`/post/search?gid=${post.writtenForGammaSuperGroupId}`}>
            {post.writtenFor}
          </Link>{' '}
        </>
      )}
      {l.news.by}{' '}
      <Link href={`/post/search?uid=${post.writtenByGammaUserId}`}>
        {post.author ?? l.news.unknown}
      </Link>
      {post.updatedAt &&
        ` | ${l.news.edited} ${i18nService.formatDate(post.updatedAt)}`}
    </p>
  );
};

export default NewsPostMeta;
