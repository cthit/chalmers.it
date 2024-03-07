import Divider from '@/components/Divider/Divider';
import style from './NewsPost.module.scss';
import Link from 'next/link';
import GammaService from '@/services/gammaService';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import ActionButton from '@/components/ActionButton/ActionButton';
import DeletePostButton from './DeletePostButton';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import SessionService from '@/services/sessionService';

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
      gammaSuperGroupId: string;
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

  const nick =
    (await GammaService.getUser(post.writtenByCid).catch(() => undefined))?.user
      .nick || post.writtenByCid;

  const ownsPost =
    (await getServerSession(authConfig))?.user?.id === post.writtenByCid ||
    post.writtenFor?.gammaSuperGroupId
      ? await SessionService.canEditGroup(post.writtenFor!.gammaSuperGroupId)
      : false;

  const canDeletePost = ownsPost || (await SessionService.isAdmin());

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
        {canDeletePost && <DeletePostButton id={post.id} />}
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
