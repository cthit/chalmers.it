import Image from 'next/image';
import styles from './page.module.scss';
import NewsList from '@/components/NewsList/NewsList';

export default function Home() {
  return (
    <main className={styles.main}>
      <NewsList />
    </main>
  );
}
