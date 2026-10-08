import styles from './page.module.scss';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import i18nService from '@/services/i18nService';
import LargeCalendar from '@/components/LargeCalendar/LargeCalendar';
import ContentArticle from '@/components/ContentArticle/ContentArticle';
import CalendarSubscribeButtons from '@/components/CalendarSubscribeButtons/CalendarSubscribeButtons';

export default async function Page(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const l = i18nService.getLocale(locale);

  const baseUrl = process.env.BASE_URL || 'https://chalmers.it';

  return (
    <main>
      <ThreePaneLayout
        left={
          <ContentArticle title={l.events.subscribe}>
            <CalendarSubscribeButtons locale={locale} httpBaseUrl={baseUrl} />
          </ContentArticle>
        }
        middle={
          <ContentArticle title={l.events.events}>
            <LargeCalendar locale={locale} className={styles.mainCalendar}/>
          </ContentArticle>
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
