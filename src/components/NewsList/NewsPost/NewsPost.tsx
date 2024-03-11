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
import { PostStatus } from '@prisma/client';

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
    status: PostStatus;
    writtenFor: {
      gammaSuperGroupId: string;
      prettyName: string;
    } | null;
  };
}

const formatDate = (date: Date) => {
  return date
    .toLocaleDateString(['sv-SE'], {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    .replace(',', '');
};

const NewsPost = async ({ post }: NewsPostProps) => {
  const group = post.writtenFor?.prettyName;

  const nick =
    (await GammaService.getNick(post.writtenByGammaUserId)) ||
    'Okänd användare';

  const ownsPost =
    (await getServerSession(authConfig))?.user?.id ===
      post.writtenByGammaUserId ||
    (post.writtenFor?.gammaSuperGroupId
      ? await SessionService.canEditGroup(post.writtenFor!.gammaSuperGroupId)
      : false);

  if (!ownsPost && post.status !== PostStatus.PUBLISHED) {
    return null;
  }

  const canDeletePost = ownsPost || (await SessionService.isAdmin());

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
        {post.status === PostStatus.SCHEDULED ? 'Schemalagd ' : null}
        {formatDate(post.createdAt)} | Skriven {group && `för ${group}`} av{' '}
        {nick}{' '}
        {post.updatedAt.getTime() - post.createdAt.getTime() > 5000 &&
          ` | Redigerad ${formatDate(post.updatedAt)}`}
      </p>
      <MarkdownView content={post.contentSv} />
    </>
  );
};

export default NewsPost;
