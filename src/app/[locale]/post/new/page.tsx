import NewsPostForm from '@/components/NewsPostForm/NewsPostForm';
import SessionService from '@/services/sessionService';
import ContentPane from '@/components/ContentPane/ContentPane';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import MarkdownCheatSheet from '@/components/MarkdownCheatSheet/MarkdownCheatSheet';
import Forbidden from '@/components/ErrorPages/403/403';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const groups = await SessionService.getActiveAddedGroups();

  if (!(await SessionService.isActive())) {
    return <Forbidden />;
  }

  return (
    <main>
      <ThreePaneLayout
        left={<MarkdownCheatSheet locale={locale} />}
        middle={
          <ContentPane>
            <NewsPostForm locale={locale} groups={groups} />
          </ContentPane>
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
