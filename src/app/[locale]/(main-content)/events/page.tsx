import './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import i18nService from '@/services/i18nService';
import LargeCalendar from '@/components/LargeCalendar/LargeCalendar';
import ContentArticle from '@/components/ContentArticle/ContentArticle';

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const l = i18nService.getLocale(locale);

  return (
    <main>
      <ThreePaneLayout
        middle={
          <ContentArticle title={l.events.events}>
            <LargeCalendar locale={locale} />
          </ContentArticle>
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
