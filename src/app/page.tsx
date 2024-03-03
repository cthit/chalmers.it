import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import styles from './page.module.scss';
import NewsList from '@/components/NewsList/NewsList';
import ContactCard from '@/components/ContactCard/ContactCard';

export default function Home() {
  return (
    <main className={styles.main}>
      <ThreePaneLayout
        left={<div></div>}
        middle={<NewsList />}
        right={<ContactCard />}
      />
    </main>
  );
}
