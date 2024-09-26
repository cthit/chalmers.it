import { Poppins } from 'next/font/google';
import styles from './Navigation.module.scss';
import Link from 'next/link';
import DropdownLink from './DropdownLink/DropdownLink';
import i18nService from '@/services/i18nService';


const poppins = Poppins({ subsets: ['latin'], weight: '500' });

type Props = {
  locale: string;
  desktop?: boolean;
};

const Navigation = ({ locale, desktop }: Props) => {
  const l = i18nService.getLocale(locale);
  const c = desktop ? styles.desktopDropdown : undefined;
  const navStyle = desktop ? styles.nav : `${styles.nav} ${styles.navMobile}`;

  return (
    <nav className={navStyle}>
      <DropdownLink
        contentClassName={c}
        text={l.nav.division}
        desktop={desktop}
      >
        <Link href="/groups">{l.pages.groups}</Link>
        <Link href="/pages/documents">{l.docs.operational}</Link>
        <Link href="/pages/programledningen">{l.nav.pl}</Link>
        <Link href="/pages/samo">{l.nav.samo}</Link>
        <Link href="/pages/honorary-members">{l.nav.honorary}</Link>
      </DropdownLink>
      <DropdownLink
        contentClassName={c}
        text={l.nav.students}
        desktop={desktop}
      >
        <Link
          target="_blank"
          href="https://www.chalmers.se/utbildning/dina-studier/hitta-kurs-och-programplaner/programplaner/TKITE"
        >
          {l.nav.courses}&nbsp;&#8599;
        </Link>
        <Link
          target="_blank"
          href="https://cloud.timeedit.net/chalmers/web/b1/"
        >
          {l.nav.grouprooms}&nbsp;&#8599;
        </Link>
        <Link
          target="_blank"
          href="https://cloud.timeedit.net/chalmers/web/public/ri1Q7.html"
        >
          {l.nav.schedule}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://cthit.slack.com/">
          Slack&nbsp;&#8599;
        </Link>
        <Link
          target="_blank"
          href="https://www.lib.chalmers.se/paa-biblioteket/skriva-ut-och-scanna/"
        >
          {l.nav.print}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://chalmersstudentkar.se/feel_safe/">
          {l.nav.studenthealth}&nbsp;&#8599;
        </Link>
      </DropdownLink>
      <DropdownLink
        contentClassName={c}
        text={l.nav.services}
        desktop={desktop}
      >
        <Link target="_blank" href="https://findit.chalmers.it/">
          {l.nav.findit}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://hubbit.chalmers.it/">
          {l.nav.hubbit}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://bookit.chalmers.it/">
          {l.nav.bookit}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://flashit.chalmers.it/">
          {l.nav.pictures}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://docs.chalmers.it/">
          {l.nav.documents}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://wiki.chalmers.it/">
          {l.nav.wiki}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://cthit.myspreadshop.it/">
          {l.nav.merch}&nbsp;&#8599;
        </Link>
        <Link href="/pages/gamma">{l.nav.gamma}</Link>
      </DropdownLink>

      <DropdownLink contentClassName={c}
        text={l.nav.business}
        desktop={desktop}>
        <Link
          target="_blank"
          href="https://armit.chalmers.it/"
          className={`${styles.navLink} ${poppins.className}`}
        >
          {l.nav.armit}&nbsp;&#8599;
        </Link>
        <Link
          href="/pages/services"
          className={`${styles.navLink} ${poppins.className}`}
        >
          {l.nav.services}
        </Link>
      </DropdownLink>
      <Link
        href="/pages/contact"
        className={`${styles.navLink} ${poppins.className}`}
      >
        {l.nav.contact}
      </Link>
    </nav>
  );
};

export default Navigation;
