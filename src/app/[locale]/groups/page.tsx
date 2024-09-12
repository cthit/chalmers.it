import styles from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ContentPane from '@/components/ContentPane/ContentPane';
import Divider from '@/components/Divider/Divider';
import DivisionGroupService from '@/services/divisionGroupService';
import i18nService from '@/services/i18nService';
import DivisionPages from '@/components/DivisionPages/DivisionPages';
import Link from 'next/link';
import React from 'react';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  return (
    <main>
      <ThreePaneLayout
        middle={<Groups locale={locale} />}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}

const Groups = async ({ locale }: { locale: string }) => {
  const types = await DivisionGroupService.getGroupTypes();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  return (
    <ContentPane>
      {' '}
      <h2>{l.pages.groups}</h2>
      <Divider />
      {types.map((type) => (
        <React.Fragment key={type.id}>
          <h3>{en ? type.nameEn : type.nameSv}</h3>
          <ul className={styles.links}>
            {type.DivisionGroup.map((group) => (
              <li key={group.id}>
                <Link href={`/groups/${group.slug}`}>{group.prettyName}</Link>
                <ul className={styles.links}>
                  <DivisionPages
                    en={en}
                    group={group.id}
                    slug={`/groups/${group.slug}`}
                  />
                </ul>
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </ContentPane>
  );
};
