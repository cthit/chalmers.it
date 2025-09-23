import { getData } from '@/actions/newsList';
import i18nService from '@/services/i18nService';
import { PostStatus } from '@prisma/client';
import styles from './NewsCard.module.scss';
import Link from 'next/link';
import MarkdownView from '@/components/MarkdownView/MarkdownView';

interface NewsCardProps {
  post: Exclude<Awaited<ReturnType<typeof getData>>, undefined>;
  locale: string;
}

const extractFirstImage = (content: string) => {
  const imgMatch = content.match(/!\[.*?\]\((.*?)\)/);
  return imgMatch ? imgMatch[1] : null;
};

const NewsCard = ({ post, locale }: NewsCardProps) => {
  const l = i18nService.getLocale(locale);
  const isScheduled = post.status === PostStatus.SCHEDULED;
  const displayDate = isScheduled
    ? (post.scheduledPublish ?? post.createdAt)
    : post.createdAt;
  const firstImg = extractFirstImage(post.content);
  const textContent = post.content.replace(/!\[.*?\]\(.*?\)/g, ''); // Remove Markdown image syntax from the post content

  return (
    <Link href={`/post/${post.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.textColumn}>
          <div className={styles.header}>
            <h3 className={styles.title}>{post.title}</h3>
          </div>
          <MarkdownView content={textContent} />
        </div>

        {firstImg && (
          <div className={styles.mediaColumn}>
            <picture>
              <img src={firstImg} alt="" />
            </picture>
          </div>
        )}

        <div className={styles.footer}>
          <p className={styles.metaLine}>
            {isScheduled && `${l.news.scheduled} `}
            {i18nService.formatDate(displayDate)}
            {` | ${l.news.written} ${l.news.by} `}
            <Link href={`/post/search?uid=${post.writtenByGammaUserId}`}>
              {post.author ?? l.news.unknown}
            </Link>
            {post.updatedAt &&
              ` | ${l.news.edited} ${i18nService.formatDate(post.updatedAt)}`}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
