import DivisionGroupService from '@/services/divisionGroupService';
import ContentPane from '@/components/ContentPane/ContentPane';
import PageForm from '@/components/PageForm/PageForm';
import SessionService from '@/services/sessionService';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const group = (await DivisionGroupService.getInfoBySlug(params.id))!;

  const canEdit = await SessionService.canEditGroup(group.gammaSuperGroupId);

  if (canEdit)
    return (
      <ContentPane>
        <title>{group.prettyName}</title>
        <PageForm
          id={group.id}
          titleEn={group.titleEn}
          titleSv={group.titleSv}
          contentEn={group.descriptionEn}
          contentSv={group.descriptionSv}
        />
      </ContentPane>
    );
  else redirect('.');
}
