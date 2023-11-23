import Link from 'next/link';
import styles from './EscapeHatch.module.scss';
import { Playfair_Display, Poppins } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const poppins = Poppins({ subsets: ['latin'], weight: '400' });

const EscapeHatch = () => {
  return (
    <div className={styles.escapeHatch}>
      <Link href="/">
        <img className={styles.itlogo} src="/itlogo.svg" />
      </Link>

      <Link href="/">
        <h1 className={`${styles.title} ${playfair.className}`}>
          Informationsteknik
        </h1>
        <h2 className={`${styles.subtitle} ${poppins.className}`}>
          Chalmers Studentkår
        </h2>
      </Link>
    </div>
  );
};

export default EscapeHatch;
