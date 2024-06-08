import DivisionGroupService from '@/services/divisionGroupService';
import GammaService from '@/services/gammaService';
import style from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import GroupMember from '@/components/GroupMember/GroupMember';
import MarkdownView from '@/components/MarkdownView/MarkdownView';
import SessionService from '@/services/sessionService';
import ContentArticle from '@/components/ContentArticle/ContentArticle';
import ContactCard from '@/components/ContactCard/ContactCard';
import i18nService from '@/services/i18nService';
import ActionLink from '@/components/ActionButton/ActionLink';

export const revalidate = 3600;

export default async function Page({
  params: { locale, id }
}: {
  params: { locale: string; id: string };
}) {
  const main = await mainContent(locale, id);
  const left = <DivisionNavigation locale={locale} />;
  const right = <ContactCard locale={locale} />;

  return <ThreePaneLayout left={left} middle={main} right={right} />;
}

const mainContent = async (locale: string, id: string) => {
  const group = (await DivisionGroupService.getInfoBySlug(id))!;
  const groupMembers = await GammaService.getSuperGroupMembers(
    group.gammaSuperGroupId
  ).catch(() => undefined);

  const canEdit = await SessionService.canEditGroup(
    group.gammaSuperGroupId
  ).catch(() => false);

  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  const side = canEdit && (
    <>
      <ActionLink href={`./${id}/edit`}>{l.general.edit}</ActionLink>
      <ActionLink href={`./${id}/new`}>{l.groups.createSubpage}</ActionLink>
    </>
  );

  return (
    <ContentArticle
      title={group.prettyName}
      subtitle={en ? group.titleEn : group.titleSv}
      titleSide={side}
    >
      <MarkdownView content={en ? group.descriptionEn : group.descriptionSv} />
      <h2>{l.groups.members}</h2>
      {groupMembers && groupMembers.length === 0 && (
        <p className={style.membersMessage}>{l.groups.membersEmpty}</p>
      )}
      {groupMembers === undefined && (
        <p className={style.membersMessage}>{l.groups.membersError}</p>
      )}
      {groupMembers && groupMembers.length !== 0 && (
        <ul className={style.memberList}>
          {groupMembers.map((member) => (
            <li key={member.user.id}>
              <GroupMember
                pfp={GammaService.getUserAvatarURL(member.user.id)}
                name={member.user.nick}
                post={en ? member.post.enName : member.post.svName}
                postStyled={member.unofficialPostName}
              />
            </li>
          ))}
        </ul>
      )}
    </ContentArticle>
  );
};
