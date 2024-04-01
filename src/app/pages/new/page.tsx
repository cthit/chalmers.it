import ContentPane from '@/components/ContentPane/ContentPane';
import Divider from '@/components/Divider/Divider';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import DivisionPageForm from '@/components/DivisionPageForm/DivisionPageForm';
import DropdownList from '@/components/DropdownList/DropdownList';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionPageService from '@/services/divisionPageService';

const indent = (depth: number) => {
  return {
    textIndent: `${depth * 10}px`
  };
};

export default async function Page() {
  const main = await mainContent();
  const left = <DivisionNavigation />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

async function mainContent() {
  const pages = (await DivisionPageService.get()).filter((p) => p.depth < 3);
  return (
    <main>
      <ContentPane>
        <DivisionPageForm pages={pages} />
      </ContentPane>
    </main>
  );
}
