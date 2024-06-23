import NewsPostMeta from '@/components/NewsList/NewsPost/NewsPostMeta/NewsPostMeta';
import Link from 'next/link';

const NewsSearchResult = ({ post, locale }: { post: any; locale: string }) => {
  return (
    <>
      <Link href={`/post/${post.id}`}>{post.title}</Link>
      <NewsPostMeta post={post} locale={locale} />
    </>
  );
};

export default NewsSearchResult;
