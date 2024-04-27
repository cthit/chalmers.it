import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import style from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import GroupMember from '@/components/GroupMember/GroupMember';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import ActionButton from '@/components/ActionButton/ActionButton';
import SessionService from '@/services/sessionService';
import ContentArticle from '@/components/ContentArticle/ContentArticle';

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

  const side = canEdit && (
    <>
      <ActionButton href={`./${id}/edit`}>Redigera</ActionButton>
      <ActionButton href={`./${id}/new`}>Skapa undersida</ActionButton>
    </>
  );

  return (
    <ContentArticle
      title={group.prettyName}
      subtitle={group.titleSv}
      titleSide={side}
    >
      <MarkdownView content={group.descriptionSv} />
      <h2>Nuvarande medlemmar</h2>
      <ul className={style.memberList}>
        {groupMembers ? (
          groupMembers.map((member) => (
            <li key={member.user.id}>
              <GroupMember
                pfp={GammaService.getUserAvatarURL(member.user.id)}
                name={member.user.nick}
                post={member.post.svName}
                postStyled={member.unofficialPostName}
              />
            </li>
          ))
        ) : (
          <li className={style.memberListError}>Kunde inte hämta medlemmar</li>
        )}
      </ul>
    </ContentArticle>
  );
};
