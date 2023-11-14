import { Playfair_Display, Poppins } from 'next/font/google';
import styles from './Navigation.module.scss';
import Link from 'next/link';

const playfair = Playfair_Display({ subsets: ['latin'] });

const EscapeHatch = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/about" className={`${styles.navLink} ${playfair.className}`}>
        Sektionen
      </Link>
      <Link href="/posts" className={`${styles.navLink} ${playfair.className}`}>
        Nyheter
      </Link>
      <Link
        href="/business"
        className={`${styles.navLink} ${playfair.className}`}
      >
        Företag
      </Link>
      <Link
        href="/applicants"
        className={`${styles.navLink} ${playfair.className}`}
      >
        Sökande
      </Link>
      <Link
        href="/contact"
        className={`${styles.navLink} ${playfair.className}`}
      >
        Kontakt
      </Link>
    </nav>
  );
};

export default EscapeHatch;
