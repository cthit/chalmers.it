import style from './NewsPost.module.scss';
import Link from 'next/link';
import DeletePostButton from './DeletePostButton';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import { PostStatus } from '@prisma/client';
import i18nService from '@/services/i18nService';
import ActionLink from '@/components/ActionButton/ActionLink';

interface NewsPostProps {
  post: {
    id: number;
    title: string;
    content: string;
    author?: string;
    createdAt: Date;
    updatedAt?: Date;
    status: PostStatus;
    writtenFor?: string;
    deletable: boolean;
    editable: boolean;
  };
  locale: string;
  standalone?: boolean;
}

const NewsPost = ({ locale, post, standalone: noNav }: NewsPostProps) => {
  const l = i18nService.getLocale(locale);

  return (
    <>
      <div className={style.titleArea}>
        <h2 className={style.title}>
          {noNav ? (
            post.title
          ) : (
            <Link href={`/post/${post.id}`}>{post.title}</Link>
          )}
        </h2>
        {post.editable && (
          <ActionLink href={`/post/${post.id}/edit`}>
            {l.general.edit}
          </ActionLink>
        )}
        {post.deletable && (
          <DeletePostButton
            text={l.general.delete}
            id={post.id}
            locale={locale}
        )}
      </div>
      <p className={style.subtitle}>
        {post.status === PostStatus.SCHEDULED ? `${l.news.scheduled} ` : null}
        {`${i18nService.formatDate(post.createdAt)} | ${l.news.written} `}
        {post.writtenFor && `${l.news.for} ${post.writtenFor}`}{' '}
        {`${l.news.by} ${post.author} `}
        {post.updatedAt &&
          ` | ${l.news.edited} ${i18nService.formatDate(post.updatedAt)}`}
      </p>
      <MarkdownView content={post.content} />
    </>
  );
};

export default NewsPost;
