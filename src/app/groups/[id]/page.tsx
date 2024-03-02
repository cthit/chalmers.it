import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import style from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import Divider from '@/components/Divider/Divider';
import ContentPane from '@/components/ContentPane/ContentPane';
import GroupMember from '@/components/GroupMember/GroupMember';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import ActionButton from '@/components/ActionButton/ActionButton';
import VerticalDivider from '@/components/VerticalDivider/VerticalDivider';
import SessionService from '@/services/sessionService';

export default async function Page({ params }: { params: { id: string } }) {
  const main = await mainContent(params);
  const left = <DivisionNavigation />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

const mainContent = async ({ id }: { id: string }) => {
  const group = (await DivisionGroupService.getInfoBySlug(id))!;
  const groupMembers = await GammaService.getSuperGroupMembers(
    group.gammaSuperGroupId
  ).catch(() => undefined);

  const canEdit = await SessionService.canEditGroup(
    group.gammaSuperGroupId
  ).catch(() => false);

  return (
    <ContentPane>
      <title>{group.prettyName}</title>
      <div className={style.title}>
        <h1>{group.prettyName}</h1>
        <VerticalDivider />
        <h3>{group.titleSv}</h3>
        {canEdit && <ActionButton href={`./${id}/edit`}>Redigera</ActionButton>}
      </div>
      <Divider />
      <MarkdownView content={group.descriptionSv} />
      <h2>Nuvarande medlemmar</h2>
      <ul className={style.memberList}>
        {groupMembers ? (
          groupMembers.map((member) => (
            <li key={member.id}>
              <GroupMember
                pfp={member.avatarUrl}
                name={member.nick}
                post={member.post.sv}
                postStyled={member.unofficialPostName}
              />
            </li>
          ))
        ) : (
          <li className={style.memberListError}>Kunde inte hämta medlemmar</li>
        )}
      </ul>
    </ContentPane>
  );
};
