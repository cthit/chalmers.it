import DivisionGroupService from '@/services/divisionGroupService';
import styles from './DivisionNavigation.module.scss';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import Link from 'next/link';
import DivisionPageService from '@/services/divisionPageService';
import ActionButton from '../ActionButton/ActionButton';

const indent = (depth: number) => {
  return {
    marginLeft: `${depth * 10}px`
  };
};

const DivisionNavigation = async () => {
  const groups = await DivisionGroupService.getAll();
  const pages = await DivisionPageService.get();

  return (
    <ContentPane>
      <h2>Om Sektionen</h2>
      <Divider />
      <ul className={styles.links}>
        <SubPages slug={'/pages'} />
      </ul>
      <h2>Kommittéer, föreningar och andra instanser</h2>
      <Divider />
      <ul className={styles.links}>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/groups/${group.slug}`}>{group.prettyName}</Link>
            <ul className={styles.links}>
              <SubPages group={group.id} slug={`/groups/${group.slug}`} />
            </ul>
          </li>
        ))}
      </ul>
    </ContentPane>
  );
};

const SubPages = async ({ group, slug }: { group?: number; slug: string }) => {
  const groupPages = await DivisionPageService.get(group);
  const depthOffset = group ? 1 : 0;
  return groupPages.map((page) => {
    const completeSlug = `${slug}/${page.completeSlug.join('/')}`;
    return (
      <li key={completeSlug} style={indent(page.depth + depthOffset)}>
        <Link href={completeSlug}>{page.titleSv}</Link>
      </li>
    );
  });
};

export default DivisionNavigation;
