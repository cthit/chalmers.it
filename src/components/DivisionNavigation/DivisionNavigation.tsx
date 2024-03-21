import DivisionGroupService from '@/services/divisionGroupService';
import styles from './DivisionNavigation.module.scss';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import Link from 'next/link';
import DivisionPageService from '@/services/divisionPageService';

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
      <ul className={styles.links}>
        {pages.map((page) => {
          const completeSlug = `/pages/${page.completeSlug.join('/')}`;
          return (
            <li key={completeSlug} style={indent(page.depth)}>
              <Link href={completeSlug}>{page.titleSv}</Link>
            </li>
          );
        })}
      </ul>
      <Divider />
      <h2>Kommitter, föreningar och andra instanser</h2>
      <Divider />
      <ul className={styles.links}>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/groups/${group.slug}`}>{group.prettyName}</Link>
          </li>
        ))}
      </ul>
    </ContentPane>
  );
};

export default DivisionNavigation;
