import Divider from '@/components/Divider/Divider';
import style from './NewsPost.module.scss';
import Link from 'next/link';
import GammaService from '@/services/gammaService';
import { marked } from 'marked';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import ActionButton from '@/components/ActionButton/ActionButton';
import DeletePostButton from './DeletePostButton';
import MarkdownView from '@/components/MarkdownView/MarkdownView';

interface NewsPostProps {
  post: {
    id: number;
    titleSv: string;
    titleEn: string;
    contentSv: string;
    contentEn: string;
    writtenByGammaUserId: string;
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
  let nick = post.writtenByGammaUserId;
  let ownsPost = false;
  try {
    nick = (await GammaService.getUser(post.writtenByGammaUserId)).nick;
    ownsPost =
      (await getServerSession(authConfig))?.user?.id ===
      post.writtenByGammaUserId;
  } catch {}

  marked.use({
    pedantic: false,
    gfm: true
  });

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
      <MarkdownView content={post.contentSv} />
    </>
  );
};

export default NewsPost;
