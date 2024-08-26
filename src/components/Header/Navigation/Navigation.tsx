import { Playfair_Display } from 'next/font/google';
import styles from './Navigation.module.scss';
import Link from 'next/link';
import DropdownLink from './DropdownLink/DropdownLink';
import i18nService from '@/services/i18nService';
import NavService from '@/services/navService';

const playfair = Playfair_Display({ subsets: ['latin'], weight: '800' });

type Props = {
  locale: string;
  desktop?: boolean;
};

const Navigation = async ({ locale, desktop }: Props) => {
  const l = i18nService.getLocale(locale);
  const c = desktop ? styles.desktopDropdown : undefined;
  const navStyle = desktop ? styles.nav : `${styles.nav} ${styles.navMobile}`;
  const items = await NavService.get();

  return (
    <nav className={navStyle}>
      {items.map((category) =>
        category.url === undefined ? (
          <Link key={category.id} href={category.url}>
            {l.en ? category.nameEn : category.nameSv}&nbsp;&#8599;
          </Link>
        ) : (
          <DropdownLink
            key={category.id}
            contentClassName={c}
            text={l.en ? category.nameEn : category.nameSv}
            desktop={desktop}
          >
            {category.NavbarItem.map((item) => {
              const target = item.url.startsWith('http') ? '_blank' : undefined;
              return (
                <Link target={target} key={item.id} href={item.url}>
                  {l.en ? item.nameEn : item.nameSv}
                </Link>
              );
            })}
          </DropdownLink>
        )
      )}

      <DropdownLink
        contentClassName={c}
        text={l.nav.division}
        desktop={desktop}
      >
        <Link href="/groups">{l.pages.groups}</Link>
        <Link href="/documents">{l.docs.operational}</Link>
        <Link
          target="_blank"
          href="https://docs.chalmers.it/"
          className={`${styles.navLink} ${playfair.className}`}
        >
          {l.docs.regulatory}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://wikit.chalmers.it/">
          {l.nav.wiki}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://flashit.chalmers.it/">
          {l.nav.pictures}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://cthit.myspreadshop.it/">
          {l.nav.merch}&nbsp;&#8599;
        </Link>
        <Link href="/pages/honorary-members">{l.nav.honorary}</Link>
        <Link href="/pages/programledningen">{l.nav.pl}</Link>
        <Link href="/pages/samo">{l.nav.samo}</Link>
      </DropdownLink>
      <DropdownLink
        contentClassName={c}
        text={l.nav.applicants}
        desktop={desktop}
      >
        <Link
          target="_blank"
          href="https://www.uhr.se/studier-och-antagning/antagningsstatistik/detaljsida/?utbildningId=81D7B349ADECC6C41777608CFE9EBBA6"
        >
          {l.nav.stats}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://nollk.it/">
          {l.nav.nollkit}&nbsp;&#8599;
        </Link>
        <Link target="_blank" href="https://wiki.chalmers.it/index.php/Nollan">
          {l.nav.studentlife}&nbsp;&#8599;
        </Link>
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
      <Link
        href="/pages/services"
        className={`${styles.navLink} ${playfair.className}`}
      >
        {l.nav.services}
      </Link>
      <Link
        target="_blank"
        href="https://armit.chalmers.it/"
        className={`${styles.navLink} ${playfair.className}`}
      >
        {l.nav.business}
      </Link>
      <Link
        href="/pages/contact"
        className={`${styles.navLink} ${playfair.className}`}
      >
        {l.nav.contact}
      </Link>
    </nav>
  );
};

export default Navigation;
