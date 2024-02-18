import DivisionGroupService from '@/services/divisionGroupService';
import styles from './page.module.scss';
import Link from 'next/link';
import ContentPane from '@/components/ContentPane/ContentPane';

export default async function Groups() {
  const groups = await DivisionGroupService.getAll();

  return (
    <main className={styles.main}>
      <ContentPane>
        <h1>Groups</h1>
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              <Link href={`/groups/${group.id}`}>{group.prettyName}</Link>
            </li>
          ))}
        </ul>
      </ContentPane>
    </main>
  );
}
