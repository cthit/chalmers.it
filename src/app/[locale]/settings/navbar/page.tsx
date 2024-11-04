import styles from './page.module.scss';
import NavService from '@/services/navService';
import EditCategoryForm from './EditCategoryForm';
import EditItemForm from './EditItemForm';
import AddItemForm from './AddItemForm';
import AddCategoryForm from './AddCategoryForm';
import React from 'react';
import i18nService from '@/services/i18nService';
import Table from '@/components/Table/Table';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const l = i18nService.getLocale(locale);
  const stats = await NavService.get();

  return (
    <main>
      <title>
        {l.settings.common.controlPanel + ' - ' + l.settings.navbar.name}
      </title>
      <h1>{l.settings.navbar.name}</h1>
      <p>{l.settings.navbar.note}</p>
      <br />
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>{l.settings.common.type}</th>
            <th>{l.settings.common.nameEn}</th>
            <th>{l.settings.common.nameSv}</th>
            <th>URL</th>
            <th>{l.settings.common.priority}</th>
            <th>{l.settings.common.actions}</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((category) => (
            <React.Fragment key={category.id}>
              <EditCategoryForm locale={locale} category={category} />
              {category.NavbarItem.map((item) => (
                <EditItemForm key={item.id} locale={locale} item={item} />
              ))}
              {category.url === '' ? (
                <AddItemForm locale={locale} categoryId={category.id} />
              ) : (
                <tr>
                  <td />
                  <td colSpan={6}>{l.settings.navbar.hasUrl}</td>
                </tr>
              )}
              <tr className={styles.spacer} />
            </React.Fragment>
          ))}
          <AddCategoryForm locale={locale} />
        </tbody>
      </Table>
    </main>
  );
}
