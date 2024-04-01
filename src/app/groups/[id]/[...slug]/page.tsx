import ContentPane from '@/components/ContentPane/ContentPane';
import Divider from '@/components/Divider/Divider';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';
import DivisionPageService from '@/services/divisionPageService';
import editContent from './edit';
import ActionButton from '@/components/ActionButton/ActionButton';

export default async function Page({
  params
}: {
  params: { id: string; slug: string[] };
}) {
  const group = (await DivisionGroupService.getInfoBySlug(params.id))!;
  const isEditing = params.slug[params.slug.length - 1] === 'edit';

  const main = isEditing
    ? editContent(group.id, params.slug)
    : mainContent(group.id, params.slug);
  const left = <DivisionNavigation />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={await main} right={right} />;
}

async function mainContent(id: number, slug: string[]) {
  const page = await DivisionPageService.getBySlug(slug, id);
  const end = slug[slug.length - 1];

  return (
    <main>
      <ContentPane>
        <h1>{page?.titleSv}</h1>
        <ActionButton href={`./${end}/edit`}>Redigera</ActionButton>
        <Divider />
        <p>{page?.contentSv}</p>
      </ContentPane>
    </main>
  );
}
