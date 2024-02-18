import DivisionGroupService from '@/services/divisionGroupService';
import styles from './DivisionNavigation.module.scss';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import Link from 'next/link';

const DivisionNavigation = async () => {
  const groups = await DivisionGroupService.getAll();

  return (
    <ContentPane>
      <h2>Kommitter, föreningar och andra instanser</h2>
      <Divider />
      <ul className={styles.links}>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/groups/${group.id}`}>{group.prettyName}</Link>
          </li>
        ))}
      </ul>
    </ContentPane>
  );
};

export default DivisionNavigation;
