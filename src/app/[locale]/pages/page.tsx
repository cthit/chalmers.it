import styles from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import Divider from '@/components/Divider/Divider';
import ActionLink from '@/components/ActionButton/ActionLink';
import i18nService from '@/services/i18nService';
import SessionService from '@/services/sessionService';
import DivisionPages from '@/components/DivisionPages/DivisionPages';
import ContentPane from '@/components/ContentPane/ContentPane';

export default async function Groups(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

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
  const isPageEditor = await SessionService.isPageEditor();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';
  console.log(isPageEditor);

  return (
    <ContentPane>
      <h2>{l.pages.about}</h2>
      {isPageEditor && (
        <ActionLink href="/pages/new">{l.pages.create}</ActionLink>
      )}
      <Divider />
      <ul className={styles.links}>
        <DivisionPages en={en} slug={'/pages'} />
      </ul>
    </ContentPane>
  );
};
