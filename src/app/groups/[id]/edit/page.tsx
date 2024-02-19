import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import style from './page.module.scss';
import Divider from '@/components/Divider/Divider';
import ContentPane from '@/components/ContentPane/ContentPane';
import GroupMember from '@/components/GroupMember/GroupMember';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import ActionButton from '@/components/ActionButton/ActionButton';
import VerticalDivider from '@/components/VerticalDivider/VerticalDivider';
import PageForm from '@/components/PageForm/PageForm';

export default async function Page({ params }: { params: { id: string } }) {
  return await mainContent(params);
}

const mainContent = async ({ id }: { id: string }) => {
  const group = (await DivisionGroupService.getInfo(Number.parseInt(id)))!;

  return (
    <ContentPane>
      <title>{group.prettyName}</title>
      <PageForm id={parseInt(id)} titleEn={group.titleEn} titleSv={group.titleSv} contentEn={group.descriptionEn} contentSv={group.descriptionSv} />
    </ContentPane>
  );
};
