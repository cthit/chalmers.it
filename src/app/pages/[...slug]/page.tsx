import ContentPane from '@/components/ContentPane/ContentPane';
import Divider from '@/components/Divider/Divider';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionPageService from '@/services/divisionPageService';

function arrayEquals(a: any[], b: any[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export default async function Page({ params }: { params: { slug: string[] } }) {
    const main = await mainContent(params.slug);
    const left = <DivisionNavigation />;
    const right = <div></div>;
  
    return <ThreePaneLayout left={left} middle={main} right={right} />;
  }

async function mainContent(slug: string[]) {
  const pages = await DivisionPageService.get();
  const page = pages.find((page) =>
    arrayEquals(page.completeSlug, slug)
  );

  return (
    <main>
      <ContentPane>
        <h1>{page?.titleSv}</h1>
        <Divider />
        <p>{page?.contentSv}</p>
      </ContentPane>
    </main>
  );
}
