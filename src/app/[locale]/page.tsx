import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import styles from './page.module.scss';
import NewsList from '@/components/NewsList/NewsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import Lunch from '@/components/Lunch/Lunch';
import Sponsors from '@/components/Sponsors/Sponsors';

export default function Home({
  params: { locale }
}: {
  params: { locale: string };
}) {
  return (
    <main className={styles.main}>
      <ThreePaneLayout
        left={<LeftBar locale={locale} />}
        middle={<NewsList locale={locale} />}
        right={<ContactCard locale={locale} />}
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
