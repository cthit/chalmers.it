import style from './NewsPost.module.scss';
import Link from 'next/link';
import DeletePostButton from './DeletePostButton';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import i18nService from '@/services/i18nService';
import ActionLink from '@/components/ActionButton/ActionLink';
import NewsPostMeta from './NewsPostMeta/NewsPostMeta';
import { getData } from '@/actions/newsList';

interface NewsPostProps {
  post: Exclude<Awaited<ReturnType<typeof getData>>, undefined>;
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
          />
        )}
      </div>
      <NewsPostMeta post={post} locale={locale} />
      <MarkdownView content={post.content} />
    </>
  );
};

export default NewsPost;
