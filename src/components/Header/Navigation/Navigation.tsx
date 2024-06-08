import { Playfair_Display } from 'next/font/google';
import styles from './Navigation.module.scss';
import Link from 'next/link';
import DropdownLink from './DropdownLink/DropdownLink';
import i18nService from '@/services/i18nService';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

type Props = {
  locale: string;
  desktop?: boolean;
};

const Navigation = ({ locale, desktop }: Props ) => {
  const l = i18nService.getLocale(locale);
  
  return (
    <nav className={styles.nav}>
      <DropdownLink text={l.nav.division} desktop={desktop}>
        <Link href="/groups">{l.pages.groups}</Link>
        <Link href="https://dokument.chalmers.it/">{l.nav.docs}</Link>
        <Link href="https://wikit.chalmers.it/">{l.nav.wiki}&nbsp;&#8599;</Link>
        <Link href="https://flashit.chalmers.it/">
          {l.nav.pictures}&nbsp;&#8599;
        </Link>
        <Link href="https://cthit.myspreadshop.it/">
          {l.nav.merch}&nbsp;&#8599;
        </Link>
        <Link href="/honorary-members">{l.nav.honorary}</Link>
        <Link href="/programledningen">{l.nav.pl}</Link>
        <Link href="/samo">{l.nav.samo}</Link>
      </DropdownLink>
      <DropdownLink text={l.nav.applicants} desktop={desktop}>
        <Link href="https://www.uhr.se/studier-och-antagning/antagningsstatistik/detaljsida/?utbildningId=81D7B349ADECC6C41777608CFE9EBBA6">
          {l.nav.stats}&nbsp;&#8599;
        </Link>
        <Link href="https://nollk.it/">{l.nav.nollkit}&nbsp;&#8599;</Link>
        <Link href="https://wiki.chalmers.it/index.php/Nollan">
          {l.nav.studentlife}
        </Link>
      </DropdownLink>
      <DropdownLink text={l.nav.students} desktop={desktop}>
        <Link href="https://www.chalmers.se/utbildning/dina-studier/hitta-kurs-och-programplaner/programplaner/TKITE/?acYear=2019%2F2020&year=1&view=year&halftime=">
          {l.nav.courses}&nbsp;&#8599;
        </Link>
        <Link href="https://cloud.timeedit.net/chalmers/web/b1/">
          {l.nav.grouprooms}&nbsp;&#8599;
        </Link>
        <Link href="https://cloud.timeedit.net/chalmers/web/public/ri1Q7.html">
          {l.nav.schedule}&nbsp;&#8599;
        </Link>
        <Link href="https://cthit.slack.com/">Slack&nbsp;&#8599;</Link>
        <Link href="https://www.lib.chalmers.se/paa-biblioteket/skriva-ut-och-scanna/">
          {l.nav.print}&nbsp;&#8599;
        </Link>
        <Link href="https://chalmersstudentkar.se/feel_safe/">
          {l.nav.studenthealth}&nbsp;&#8599;
        </Link>
      </DropdownLink>
      <Link
        href="/services"
        className={`${styles.navLink} ${playfair.className}`}
      >
        {l.nav.services}
      </Link>
      <Link
        href="/business"
        className={`${styles.navLink} ${playfair.className}`}
      >
        {l.nav.business}
      </Link>
      <Link
        href="/contact"
        className={`${styles.navLink} ${playfair.className}`}
      >
        {l.nav.contact}
      </Link>
    </nav>
  );
};

export default Navigation;
