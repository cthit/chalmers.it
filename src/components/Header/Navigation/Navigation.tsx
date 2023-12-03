import { Playfair_Display, Poppins } from 'next/font/google';
import styles from './Navigation.module.scss';
import Link from 'next/link';
import DropdownLink from './DropdownLink/DropdownLink';

const playfair = Playfair_Display({ subsets: ['latin'] });

const Navigation = () => {
  return (
    <nav className={styles.nav} >
      <Link href="/posts" className={`${styles.navLink} ${playfair.className}`}>
        Nyheter
      </Link>
      <DropdownLink text="Sektionen">
        <Link href="/committees">
          Kommittéer, föreningar och andra instanser
        </Link>
        <Link href="https://dokument.chalmers.it/">Dokument</Link>
        <Link href="https://wikit.chalmers.it/">Wiki</Link>
        <Link href="https://flashit.chalmers.it/">Bilder</Link>
        <Link href="https://cthit.myspreadshop.it/">Merch</Link>
        <Link href="/honorary-members">Hedersmedlemmar</Link>
        <Link href="/programledningen">Programledningen</Link>
        <Link href="/samo">SAMO</Link>
      </DropdownLink>
      <DropdownLink text="Sökande">
        <Link href="https://www.uhr.se/studier-och-antagning/antagningsstatistik/detaljsida/?utbildningId=81D7B349ADECC6C41777608CFE9EBBA6">
          Antagningsstatistik
        </Link>
        <Link href="https://nollk.it/">NollKITs hemsida</Link>
        <Link href="https://wiki.chalmers.it/index.php/Nollan">
          Studentlivet
        </Link>
      </DropdownLink>
      <DropdownLink text="Studenter">
        <Link href="https://www.chalmers.se/utbildning/dina-studier/hitta-kurs-och-programplaner/programplaner/TKITE/?acYear=2019%2F2020&year=1&view=year&halftime=">
          Kurser
        </Link>
        <Link href="https://cloud.timeedit.net/chalmers/web/b1/">Boka grupprum</Link>
        <Link href="https://cloud.timeedit.net/chalmers/web/public/ri1Q7.html">Schema</Link>
        <Link href="https://cthit.slack.com/">Slack</Link>
        <Link href="https://www.lib.chalmers.se/paa-biblioteket/skriva-ut-och-scanna/">
          Skriva ut
        </Link>
        <Link href="https://chalmersstudentkar.se/feel_safe/">
          Studiehälsa
        </Link>
      </DropdownLink>
      <Link
        href="/business"
        className={`${styles.navLink} ${playfair.className}`}
      >
        Företag
      </Link>
      <DropdownLink text="Kontakt">
        <Link href="/samo">SAMO</Link>
        <Link href="/committees/styrit">StyrIT</Link>
        <Link href="/programledningen">Programledningen</Link>
      </DropdownLink>
    </nav>
  );
};

export default Navigation;
