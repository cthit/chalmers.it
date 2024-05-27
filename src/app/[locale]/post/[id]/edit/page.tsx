import NewsPostForm from '@/components/NewsPostForm/NewsPostForm';
import SessionService from '@/services/sessionService';
import NewsService from '@/services/newsService';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth/auth';
import ContentPane from '@/components/ContentPane/ContentPane';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import MarkdownCheatSheet from '@/components/MarkdownCheatSheet/MarkdownCheatSheet';
import ContactCard from '@/components/ContactCard/ContactCard';

export default async function Page({
  params
}: {
  params: { locale: string; id: string };
}) {
  const groups = await SessionService.getActiveGroups();
  const newsPost = await NewsService.get(Number.parseInt(params.id));

  if (newsPost === null) {
    return notFound();
  }

  if (
    !(
      (await getServerSession(authConfig))?.user?.id ===
      newsPost.writtenByGammaUserId
    )
  ) {
    return notFound();
  }

  return (
    <main>
      <ThreePaneLayout
        left={<MarkdownCheatSheet locale={params.locale} />}
        middle={
          <ContentPane>
            <NewsPostForm
              locale={params.locale}
              groups={groups}
              id={newsPost!.id}
              titleEn={newsPost!.titleEn}
              titleSv={newsPost!.titleSv}
              contentEn={newsPost!.contentEn}
              contentSv={newsPost!.contentSv}
              writtenByGammaUserId={newsPost!.writtenByGammaUserId}
              connectedEvents={newsPost!.connectedEvents}
            />
          </ContentPane>
        }
        right={<ContactCard locale={params.locale} />}
      />
    </main>
  );
}
