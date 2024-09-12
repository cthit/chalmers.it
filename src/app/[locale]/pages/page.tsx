import styles from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import Divider from '@/components/Divider/Divider';
import ActionLink from '@/components/ActionButton/ActionLink';
import i18nService from '@/services/i18nService';
import SessionService from '@/services/sessionService';
import DivisionPages from '@/components/DivisionPages/DivisionPages';
import ContentPane from '@/components/ContentPane/ContentPane';

export default async function Groups({
  params: { locale }
}: {
  params: { locale: string };
}) {
  return (
    <main>
      <ThreePaneLayout
        middle={<Pages locale={locale} />}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}

const Pages = async ({ locale }: { locale: string }) => {
  const isAdmin = await SessionService.isAdmin();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  return (
    <ContentPane>
      <h2>{l.pages.about}</h2>
      {isAdmin && <ActionLink href="/pages/new">{l.pages.create}</ActionLink>}
      <Divider />
      <ul className={styles.links}>
        <DivisionPages en={en} slug={'/pages'} />
      </ul>
    </ContentPane>
  );
};
