import { getData } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import NewsPost from '@/components/NewsList/NewsPost/NewsPost';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import NewsService from '@/services/newsService';
import { notFound } from 'next/navigation';

export default async function Page({
  params
}: {
  params: { id: string; locale: string };
}) {
  const post = await NewsService.get(+params.id);
  if (!post) notFound();
  const postData = await getData(post, params.locale);
  if (!postData) notFound();

  return (
    <main>
      <ThreePaneLayout
        middle={
          <ContentPane>
            {post && (
              <NewsPost standalone locale={params.locale} post={postData} />
            )}
          </ContentPane>
        }
        right={<ContactCard locale={params.locale} />}
      />
    </main>
  );
}
