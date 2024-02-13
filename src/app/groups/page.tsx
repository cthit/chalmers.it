import DivisionGroupService from '@/services/divisionGroupService';
import styles from './page.module.scss';
import Link from 'next/link';

export default async function Groups() {
  const groups = await DivisionGroupService.getAll();

  return (
    <main>
      <h1>Groups</h1>
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            <Link href={`/groups/${group.id}`}>{group.prettyName}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
