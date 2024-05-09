import DivisionGroupService from '@/services/divisionGroupService';
import styles from './DivisionNavigation.module.scss';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import Link from 'next/link';
import DivisionPageService from '@/services/divisionPageService';
import ActionButton from '../ActionButton/ActionButton';
import SessionService from '@/services/sessionService';
import i18nService from '@/services/i18nService';
import ActionLink from '../ActionButton/ActionLink';

const indent = (depth: number) => {
  return {
    marginLeft: `${depth * 10}px`
  };
};

const DivisionNavigation = async ({ locale }: { locale: string }) => {
  const groups = await DivisionGroupService.getAll();
  const isAdmin = await SessionService.isAdmin();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  return (
    <ContentPane>
      <h2>{l.pages.about}</h2>
      {isAdmin && (
        <ActionLink href="/pages/new">{l.general.create}</ActionLink>
      )}
      <Divider />
      <ul className={styles.links}>
        <SubPages en={en} slug={'/pages'} />
      </ul>
      <h2>{l.pages.groups}</h2>
      <Divider />
      <ul className={styles.links}>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/groups/${group.slug}`}>{group.prettyName}</Link>
            <ul className={styles.links}>
              <SubPages
                en={en}
                group={group.id}
                slug={`/groups/${group.slug}`}
              />
            </ul>
          </li>
        ))}
      </ul>
    </ContentPane>
  );
};

const SubPages = async ({
  en,
  group,
  slug
}: {
  en: boolean;
  group?: number;
  slug: string;
}) => {
  const groupPages = await DivisionPageService.get(group);
  const depthOffset = group ? 1 : 0;
  return groupPages.map((page) => {
    const completeSlug = `${slug}/${page.completeSlug.join('/')}`;
    return (
      <li key={completeSlug} style={indent(page.depth + depthOffset)}>
        <Link href={completeSlug}>{en ? page.titleEn : page.titleSv}</Link>
      </li>
    );
  });
};

export default DivisionNavigation;
