import { Playfair_Display, Poppins } from 'next/font/google';
import styles from './Navigation.module.scss';
import Link from 'next/link';
import DropdownLink from './DropdownLink/DropdownLink';

const playfair = Playfair_Display({ subsets: ['latin'] });

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <DropdownLink text="Sektionen">
        <Link href="https://dokument.chalmers.it/">Dokument</Link>
        <Link href="/programledningen">Programledningen</Link>
        <Link href="/samo">SAMO</Link>
        <Link href="/committees">
          Kommittéer, föreningar och andra instanser
        </Link>
        <Link href="/honorary-members">Hedersmedlemmar</Link>
        <Link href="https://flashit.chalmers.it/">Bilder</Link>
        <Link href="https://cthit.myspreadshop.it/">Merch</Link>
      </DropdownLink>
      <Link href="/posts" className={`${styles.navLink} ${playfair.className}`}>
        Nyheter
      </Link>
      <Link
        href="/business"
        className={`${styles.navLink} ${playfair.className}`}
      >
        Företag
      </Link>
      <DropdownLink text="Sökande">
        <Link href="https://www.uhr.se/studier-och-antagning/antagningsstatistik/detaljsida/?utbildningId=81D7B349ADECC6C41777608CFE9EBBA6">
          Antagningsstatistik
        </Link>
        <Link href="https://wiki.chalmers.it/index.php/Kurser">Kurser</Link>
        <Link href="https://nollk.it/">NollKITs hemsida</Link>
        <Link href="https://wiki.chalmers.it/index.php/Nollan">
          Studentlivet
        </Link>
      </DropdownLink>
      <DropdownLink text="Kontakt">
        <Link href="/samo">SAMO</Link>
        <Link href="/committees/styrit">StyrIT</Link>
        <Link href="/programledningen">Programledningen</Link>
      </DropdownLink>
    </nav>
  );
};

export default Navigation;
