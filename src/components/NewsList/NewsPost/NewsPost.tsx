import Divider from '@/components/Divider/Divider';
import style from './NewsPost.module.scss';
import Link from 'next/link';
import { FC } from 'react';
import GammaService from '@/services/gammaService';

interface ActionButtonProps {
  post: {
    id: number;
    titleSv: string;
    titleEn: string;
    contentSv: string;
    contentEn: string;
    writtenByCid: string;
    createdAt: Date;
    updatedAt: Date;
    divisionGroupId: number | null;
    mediaSha256: string | null;
  };
}

const NewsPost: FC<ActionButtonProps> = async ({ post }) => {
  let nick = post.writtenByCid;
  try {
    nick = (await GammaService.getUser(post.writtenByCid)).nick;
  } catch {}

  return (
    <>
      <Divider />
      <div>
        <h2 className={style.title}>
          <Link href={`/post/${post.id}`}>{post.titleSv}</Link>
        </h2>
        <p className={style.subtitle}>
          {post.createdAt.toLocaleString()} | Skriven{' '}
          {post.divisionGroupId != null && `för ${post.divisionGroupId}`} av{' '}
          {nick}
        </p>
        <p>{post.contentSv}</p>
      </div>
    </>
  );
};

export default NewsPost;
