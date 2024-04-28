import ContentPane from '@/components/ContentPane/ContentPane';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import DivisionPageForm from '@/components/DivisionPageForm/DivisionPageForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionPageService from '@/services/divisionPageService';

export default async function Page() {
  const main = await mainContent();
  const left = <DivisionNavigation />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

async function mainContent() {
  const pages = await DivisionPageService.get();
  return (
    <main>
      <ContentPane>
        <DivisionPageForm pages={pages} />
      </ContentPane>
    </main>
  );
}
