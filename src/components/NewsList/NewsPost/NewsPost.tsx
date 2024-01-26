import Divider from '@/components/Divider/Divider';
import style from './NewsPost.module.scss';
import Link from 'next/link';
import GammaService from '@/services/gammaService';
import { marked } from 'marked';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import ActionButton from '@/components/ActionButton/ActionButton';
import DeletePostButton from './DeletePostButton';

interface NewsPostProps {
  post: {
    id: number;
    titleSv: string;
    titleEn: string;
    contentSv: string;
    contentEn: string;
    writtenByCid: string;
    createdAt: Date;
    updatedAt: Date;
    writtenFor: {
      prettyName: string;
    } | null;
  };
}

type PropsThing = {
  day: 'numeric';
  month: 'numeric';
  year: 'numeric';
  hour: '2-digit';
  minute: '2-digit';
};

const NewsPost = async ({ post }: NewsPostProps) => {
  const group = post.writtenFor?.prettyName;
  let nick = post.writtenByCid;
  let ownsPost = false;
  try {
    nick = (await GammaService.getUser(post.writtenByCid)).nick;
    ownsPost =
      (await getServerSession(authConfig))?.user?.id === post.writtenByCid;
  } catch {}

  marked.use({
    pedantic: false,
    gfm: true
  });

  const getMarkdownText = () => {
    var rawMarkup = marked.parse(post.contentSv);
    return { __html: rawMarkup };
  };

  const propsThing: PropsThing = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return (
    <>
      <Divider />
      <div className={style.titleArea}>
        <h2 className={style.title}>
          <Link href={`/post/${post.id}`}>{post.titleSv}</Link>
        </h2>
        {ownsPost && (
          <ActionButton href={`/post/${post.id}/edit`}>Redigera</ActionButton>
        )}
        {ownsPost && <DeletePostButton id={post.id} />}
      </div>
      <p className={style.subtitle}>
        {post.createdAt.toLocaleString([], propsThing).replace(',', '')} |
        Skriven {group && `för ${group}`} av {nick}{' '}
        {post.updatedAt.getTime() - post.createdAt.getTime() > 5000 &&
          ` | Redigerad ${post.updatedAt
            .toLocaleString([], propsThing)
            .replace(',', '')}`}
      </p>
      <div
        className={style.content}
        dangerouslySetInnerHTML={getMarkdownText()}
      />
    </>
  );
};

export default NewsPost;
