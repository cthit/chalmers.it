import style from './NewsPost.module.scss';
import Link from 'next/link';
import GammaService from '@/services/gammaService';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import DeletePostButton from './DeletePostButton';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import SessionService from '@/services/sessionService';
import { PostStatus } from '@prisma/client';
import i18nService from '@/services/i18nService';
import ActionLink from '@/components/ActionButton/ActionLink';

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
  locale: string;
  noNav?: boolean;
}

const NewsPost = async ({ locale, post, noNav }: NewsPostProps) => {
  const group = post.writtenFor?.prettyName;
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  const nick =
    (await GammaService.getNick(post.writtenByGammaUserId)) || l.news.unknown;

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
  const title = en ? post.titleEn : post.titleSv;

  return (
    <>
      <div className={style.titleArea}>
        <h2 className={style.title}>
          {noNav ? title : <Link href={`/post/${post.id}`}>{title}</Link>}
        </h2>
        {ownsPost && (
          <ActionLink href={`/post/${post.id}/edit`}>
            {l.general.edit}
          </ActionLink>
        )}
        {canDeletePost && (
          <DeletePostButton text={l.general.delete} id={post.id} />
        )}
      </div>
      <p className={style.subtitle}>
        {post.status === PostStatus.SCHEDULED ? `${l.news.scheduled} ` : null}
        {`${i18nService.formatDate(post.createdAt)} | ${l.news.written} `}
        {group && `${l.news.for} ${group}`} {`${l.news.by} ${nick} `}
        {post.updatedAt.getTime() - post.createdAt.getTime() > 5000 &&
          ` | ${l.news.edited} ${i18nService.formatDate(post.updatedAt)}`}
      </p>
      <MarkdownView content={en ? post.contentEn : post.contentSv} />
    </>
  );
};

export default NewsPost;
