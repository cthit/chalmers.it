import ContentPane from '@/components/ContentPane/ContentPane';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import DivisionPageForm from '@/components/DivisionPageForm/DivisionPageForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';
import DivisionPageService from '@/services/divisionPageService';

export default async function Page({ params }: { params: { id: string } }) {
  const group = (await DivisionGroupService.getInfoBySlug(params.id))!;

  const main = await mainContent(group.id);
  const left = <DivisionNavigation />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

async function mainContent(id: number) {
  const pages = await DivisionPageService.get(id);
  return (
    <main>
      <ContentPane>
        <DivisionPageForm divisionGroupId={id} pages={pages} />
      </ContentPane>
    </main>
  );
}
