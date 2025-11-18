import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import styles from './page.module.scss';
import NewsList from '@/components/NewsList/NewsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import Lunch from '@/components/Lunch/Lunch';
import Sponsors from '@/components/Sponsors/Sponsors';
import Calendar from '@/components/Calendar/Calendar';

export const revalidate = 3600;

export default async function Home(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  return (
    <main className={styles.main}>
      <ThreePaneLayout
        left={<LeftBar locale={locale} />}
        middle={<NewsList locale={locale} />}
        right={
          <>
            <Calendar locale={locale} />
            <ContactCard locale={locale} />
          </>
        }
      />
    </main>
  );
}

const LeftBar = ({ locale }: { locale: string }) => {
  return (
    <div className={styles.sidePanel}>
      <Lunch locale={locale} />
      <Sponsors locale={locale} />
    </div>
  );
};
