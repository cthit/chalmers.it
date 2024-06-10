import DivisionGroupService from '@/services/divisionGroupService';
import PageForm from '@/components/PageForm/PageForm';
import SessionService from '@/services/sessionService';
import { notFound } from 'next/navigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContentPane from '@/components/ContentPane/ContentPane';
import MarkdownCheatSheet from '@/components/MarkdownCheatSheet/MarkdownCheatSheet';

export default async function Page({
  params
}: {
  params: { id: string; locale: string };
}) {
  const group = (await DivisionGroupService.getInfoBySlug(params.id))!;

  const canEdit = await SessionService.canEditGroup(group.gammaSuperGroupId);
  if (!canEdit) notFound();

  return (
    <ThreePaneLayout
      left={<MarkdownCheatSheet locale={params.locale} />}
      middle={
        <ContentPane>
          <title>{group.prettyName}</title>
          <PageForm
            id={group.id}
            contentEn={group.descriptionEn}
            contentSv={group.descriptionSv}
            slug={params.id}
            locale={params.locale}
          />
        </ContentPane>
      }
      right={<ContactCard locale={params.locale} />}
    />
  );
}
