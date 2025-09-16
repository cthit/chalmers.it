import { getData } from '@/actions/newsList';
import i18nService from '@/services/i18nService';
import { PostStatus } from '@prisma/client';
import styles from './NewsCard.module.scss';
import Link from 'next/link';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

interface NewsCardProps {
  post: Exclude<Awaited<ReturnType<typeof getData>>, undefined>;
  locale: string;
}

const NewsCard = ({ post, locale }: NewsCardProps) => {
  const l = i18nService.getLocale(locale);
  const scheduled = post.status === PostStatus.SCHEDULED;
  const date = scheduled
    ? (post.scheduledPublish ?? post.createdAt)
    : post.createdAt;

  // Build a sanitized HTML excerpt that preserves images and basic formatting
  marked.use({ pedantic: false, breaks: true, gfm: true });
  const renderedHtml = marked.parse(post.content) as string;
  const sanitizedHtml = sanitizeHtml(renderedHtml, {
    allowedTags: [
      'p',
      'br',
      'strong',
      'em',
      'del',
      'blockquote',
      'ul',
      'ol',
      'li',
      'code',
      'pre',
      'a',
      'img'
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title']
    },
    allowedSchemes: sanitizeHtml.defaults.allowedSchemes.concat([
      'blob',
      'data'
    ])
  });

  // Split content into text (left) and first image (right)
  const firstImgMatch = sanitizedHtml.match(/<img\b[^>]*>/i);
  const firstImg = firstImgMatch ? firstImgMatch[0] : '';
  const textOnlyHtml = firstImg
    ? sanitizedHtml.replace(firstImg, '')
    : sanitizedHtml;

  return (
    <Link href={`/post/${post.id}`} className={styles.cardLink}>
      <article className={styles.card}>
        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.textColumn}>
              <div className={styles.header}>
                <h3 className={styles.title}>{post.title}</h3>
              </div>
              <div dangerouslySetInnerHTML={{ __html: textOnlyHtml }} />
            </div>
            {firstImg && (
              <div
                className={styles.mediaColumn}
                dangerouslySetInnerHTML={{ __html: firstImg }}
              />
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.metaLine}>
            {scheduled ? `${l.news.scheduled} ` : ''}
            {i18nService.formatDate(date)}
            {` | ${l.news.written} ${l.news.by} `}
            <Link href={`/post/search?uid=${post.writtenByGammaUserId}`}>
              {post.author ?? l.news.unknown}
            </Link>
            {post.updatedAt
              ? ` | ${l.news.edited} ${i18nService.formatDate(post.updatedAt)}`
              : ''}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default NewsCard;
