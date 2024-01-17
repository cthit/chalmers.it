import Divider from '@/components/Divider/Divider';
import style from './NewsPost.module.scss';
import Link from 'next/link';
import GammaService from '@/services/gammaService';
import { marked } from 'marked';

interface NewsPostProps {
  post: {
    id: number;
    titleSv: string;
    titleEn: string;
    contentSv: string;
    contentEn: string;
    writtenByCid: string;
    createdAt: Date;
    writtenFor: {
        prettyName: string;
    } | null;
  };
}

const NewsPost = async ({ post }: NewsPostProps) => {
  const group = post.writtenFor?.prettyName;
  let nick = post.writtenByCid;
  try {
    nick = (await GammaService.getUser(post.writtenByCid)).nick;
  } catch {}

  marked.use({
    pedantic: false,
    gfm: true
  });

  const getMarkdownText = () => {
    var rawMarkup = marked.parse(post.contentSv);
    return { __html: rawMarkup };
  };

  return (
    <>
      <Divider />
      <div>
        <h2 className={style.title}>
          <Link href={`/post/${post.id}`}>{post.titleSv}</Link>
        </h2>
        <p className={style.subtitle}>
          {post.createdAt.toLocaleString()} | Skriven {group && `för ${group}`}{' '}
          av {nick}
        </p>
        <div
          className={style.content}
          dangerouslySetInnerHTML={getMarkdownText()}
        />
      </div>
    </>
  );
};

export default NewsPost;
