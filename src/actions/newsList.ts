'use server';

import { authConfig } from '@/auth/auth';
import GammaService from '@/services/gammaService';
import NewsService from '@/services/newsService';
import SessionService from '@/services/sessionService';
import { PostStatus } from '@prisma/client';
import { getServerSession } from 'next-auth/next';

export const getData = async (
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
  },
  locale: string
) => {
  const group = post.writtenFor?.prettyName;
  const en = locale === 'en';

  const author = await GammaService.getNick(post.writtenByGammaUserId);

  const ownsPost =
    (await getServerSession(authConfig))?.user?.id ===
      post.writtenByGammaUserId ||
    (post.writtenFor?.gammaSuperGroupId
      ? await SessionService.canEditGroup(post.writtenFor!.gammaSuperGroupId)
      : false);

  if (!ownsPost && post.status !== PostStatus.PUBLISHED) {
    return undefined;
  }

  const deletable = ownsPost || (await SessionService.isAdmin());
  const title = en ? post.titleEn : post.titleSv;

  return {
    id: post.id,
    title,
    content: en ? post.contentEn : post.contentSv,
    author,
    createdAt: post.createdAt,
    updatedAt:
      post.updatedAt.getTime() - post.createdAt.getTime() > 5000
        ? post.updatedAt
        : undefined,
    status: post.status,
    writtenFor: group,
    editable: ownsPost,
    deletable
  };
};

export const getPage = async (page: number, locale: string) => {
  const user = await SessionService.getUser();
  const groups = await SessionService.getActiveGroups();
  const posts = await NewsService.getPage(
    page,
    3,
    user?.id,
    groups.map((g) => g.superGroup.id)
  );
  return Promise.all(posts.map((post) => getData(post, locale)));
};

export async function search(
  query: string,
  locale: string,
  before?: Date,
  after?: Date
) {
  const user = await SessionService.getUser();
  const groups = await SessionService.getActiveGroups();
  const posts = await NewsService.search(
    query,
    locale,
    before,
    after,
    user?.id,
    groups.map((g) => g.superGroup.id)
  );
  return Promise.all(posts.map((post) => getData(post, locale)));
}
