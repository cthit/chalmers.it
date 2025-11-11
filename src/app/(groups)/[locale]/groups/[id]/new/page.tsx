import ContentPane from '@/components/ContentPane/ContentPane';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import DivisionPageForm from '@/components/DivisionPageForm/DivisionPageForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';
import DivisionPageService from '@/services/divisionPageService';

export default async function Page(props: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const params = await props.params;
  const group = (await DivisionGroupService.getInfoBySlug(params.id))!;

  const main = await mainContent(group.id, params.locale);
  const left = <DivisionNavigation locale={params.locale} />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

async function mainContent(id: number, locale: string) {
  const pages = await DivisionPageService.get(id);
  return (
    <main>
      <ContentPane>
        <DivisionPageForm divisionGroupId={id} pages={pages} locale={locale} />
      </ContentPane>
    </main>
  );
}
