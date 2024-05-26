import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import NewsPost from '@/components/NewsList/NewsPost/NewsPost';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import GammaService from '@/services/gammaService';
import NewsService from '@/services/newsService';
import { notFound } from 'next/navigation';

type Post = {
  title: string;
  text: string;
  postedBy: string;
};

export default async function Page({
  params
}: {
  params: { id: string; locale: string };
}) {
  const post = await NewsService.get(+params.id);
  if (!post) notFound();

  return (
    <main>
      <ThreePaneLayout
        middle={
          <ContentPane>
            {post && <NewsPost standalone locale={params.locale} post={post} />}
          </ContentPane>
        }
        right={<ContactCard locale={params.locale} />}
      />
    </main>
  );
}
