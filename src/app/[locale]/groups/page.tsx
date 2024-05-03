import DivisionGroupService from '@/services/divisionGroupService';
import styles from './page.module.scss';
import Link from 'next/link';
import ContentPane from '@/components/ContentPane/ContentPane';
import i18nService from '@/services/i18nService';

export default async function Groups({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const groups = await DivisionGroupService.getAll();
  const l = i18nService.getLocale(locale);

  return (
    <main className={styles.main}>
      <ContentPane>
        <h1>{l.pages.groups}</h1>
        <ul className={styles.groupList}>
          {groups.map((group) => (
            <li key={group.id}>
              <Link href={`/groups/${group.slug}`}>{group.prettyName}</Link>
            </li>
          ))}
        </ul>
      </ContentPane>
    </main>
  );
}
