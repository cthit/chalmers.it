import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import styles from './page.module.scss';
import NewsList from '@/components/NewsList/NewsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import Lunch from '@/components/Lunch/Lunch';
import Sponsors from '@/components/Sponsors/Sponsors';

export default function Home() {
  return (
    <main className={styles.main}>
      <ThreePaneLayout
        left={<><Lunch /><Sponsors /></>}
        middle={<NewsList />}
        right={<ContactCard />}
      />
    </main>
  );
}
