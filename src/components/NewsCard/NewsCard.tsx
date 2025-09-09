import Link from 'next/link';
import { getData } from '@/actions/newsList';
import i18nService from '@/services/i18nService';
import { PostStatus } from '@prisma/client';
import styles from './NewsCard.module.scss';

interface NewsCardProps {
  post: Exclude<Awaited<ReturnType<typeof getData>>, undefined>;
  locale: string;
}

const NewsCard = ({ post, locale }: NewsCardProps) => {
  const l = i18nService.getLocale(locale);
  const scheduled = post.status === PostStatus.SCHEDULED;
  const date = scheduled ? post.scheduledPublish ?? post.createdAt : post.createdAt;
  
  // Create a preview of the content (first 150 characters)
  const contentPreview = post.content
    .replace(/[#*`_~]/g, '') // Remove markdown formatting
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim()
    .substring(0, 150);
  
  const truncatedContent = contentPreview.length < post.content.length 
    ? contentPreview + '...' 
    : contentPreview;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <div className={styles.meta}>
          <span className={styles.date}>
            {scheduled ? `${l.news.scheduled} ` : null}
            {i18nService.formatDate(date)}
          </span>
        </div>
      </div>
      
      <div className={styles.content}>
        <p className={styles.preview}>{truncatedContent}</p>
      </div>
      
      <div className={styles.footer}>
        <div className={styles.author}>
          <span className={styles.by}>{l.news.by} </span>
          <Link href={`/post/search?uid=${post.writtenByGammaUserId}`}>
            {post.author ?? l.news.unknown}
          </Link>
        </div>
        
        {post.writtenFor && (
          <div className={styles.group}>
            <span className={styles.for}>{l.news.for} </span>
            <Link href={`/post/search?gid=${post.writtenForGammaSuperGroupId}`}>
              {post.writtenFor}
            </Link>
          </div>
        )}
      </div>
    </article>
  );
};

export default NewsCard;
