import NewsPostForm from '@/components/NewsPostForm/NewsPostForm';
import SessionService from '@/services/sessionService';
import NewsService from '@/services/newsService';
import { notFound } from 'next/navigation';
import ContentPane from '@/components/ContentPane/ContentPane';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import MarkdownCheatSheet from '@/components/MarkdownCheatSheet/MarkdownCheatSheet';
import ContactCard from '@/components/ContactCard/ContactCard';
import Forbidden from '@/components/ErrorPages/403/403';
import DivisionGroupService from '@/services/divisionGroupService';

export default async function Page({
  params
}: {
  params: { locale: string; id: string };
}) {
  const groups = await SessionService.getActiveAddedGroups();
  const newsPost = await NewsService.get(Number.parseInt(params.id));

  if (newsPost === null) {
    notFound();
  }

  if (!(await SessionService.isNewsPostOwner(newsPost.id))) {
    return <Forbidden />;
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
              group={newsPost!.writtenFor?.gammaSuperGroupId}
            />
          </ContentPane>
        }
        right={<ContactCard locale={params.locale} />}
      />
    </main>
  );
}
