import DivisionGroupService from '@/services/divisionGroupService';
import styles from './DivisionNavigation.module.scss';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import Link from 'next/link';
import SessionService from '@/services/sessionService';
import i18nService from '@/services/i18nService';
import ActionLink from '../ActionButton/ActionLink';
import DivisionPages from '../DivisionPages/DivisionPages';
import React from 'react';

const DivisionNavigation = async ({
  locale,
  groupId,
  visitedSlug
}: {
  locale: string;
  groupId?: number;
  visitedSlug?: string[];
}) => {
  const types = await DivisionGroupService.getGroupTypes();
  const isAdmin = await SessionService.isAdmin();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';
  const currentSlug =
    visitedSlug !== undefined ? visitedSlug.join('/') : undefined;

  return (
    <ContentPane>
      <h2>{l.pages.about}</h2>
      {isAdmin && <ActionLink href="/pages/new">{l.pages.create}</ActionLink>}
      <Divider />
      <ul className={styles.links}>
        <DivisionPages en={en} slug={'/pages'} visitedSlug={currentSlug} />
      </ul>
      <h2>{l.pages.groups}</h2>
      {isAdmin && (
        <ActionLink href="/settings/groups">{l.general.manage}</ActionLink>
      )}
      <Divider />
      {types.map((type) => (
        <React.Fragment key={type.id}>
          <h3>{en ? type.nameEn : type.nameSv}</h3>
          <ul className={styles.links}>
            {type.DivisionGroup.map((group) => (
              <li key={group.id}>
                <Link
                  href={`/groups/${group.slug}`}
                  className={
                    group.id === groupId && visitedSlug === undefined
                      ? styles.selected
                      : undefined
                  }
                >
                  {group.prettyName}
                </Link>
                <ul className={styles.links}>
                  <DivisionPages
                    en={en}
                    group={group.id}
                    slug={`/groups/${group.slug}`}
                    visitedSlug={currentSlug}
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

export default DivisionNavigation;
