import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import styles from './page.module.scss';
import NewsList from '@/components/NewsList/NewsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import Lunch from '@/components/Lunch/Lunch';

export default function Home() {
  return (
    <main className={styles.main}>
      <ThreePaneLayout
        left={<Lunch />}
        middle={<NewsList />}
        right={<ContactCard />}
      />
    </main>
  );
}
