import DivisionGroupService from '@/services/divisionGroupService';
import ContentPane from '@/components/ContentPane/ContentPane';
import PageForm from '@/components/PageForm/PageForm';
import SessionService from '@/services/sessionService'; 
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const group = (await DivisionGroupService.getInfo(
    Number.parseInt(params.id)
  ))!;

  const canEdit = await SessionService.canEditGroup(group.gammaSuperGroupId);

  if (canEdit) return await mainContent(params);
  else redirect('.');
}

const mainContent = async ({ id }: { id: string }) => {
  const group = (await DivisionGroupService.getInfo(Number.parseInt(id)))!;

  return (
    <ContentPane>
      <title>{group.prettyName}</title>
      <PageForm
        id={parseInt(id)}
        titleEn={group.titleEn}
        titleSv={group.titleSv}
        contentEn={group.descriptionEn}
        contentSv={group.descriptionSv}
      />
    </ContentPane>
  );
};
