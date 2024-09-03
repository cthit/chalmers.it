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
      {items.map((category) => {
        const categoryIsExternal = category.url.startsWith('http');
        const categoryTarget = categoryIsExternal ? '_blank' : undefined;
        return category.url !== '' ? (
          <Link
            key={category.id}
            href={category.url}
            className={`${styles.navLink} ${playfair.className}`}
            target={categoryTarget}
          >
            {l.en ? category.nameEn : category.nameSv}
          </Link>
        ) : (
          <DropdownLink
            key={category.id}
            contentClassName={c}
            text={l.en ? category.nameEn : category.nameSv}
            desktop={desktop}
          >
            {category.NavbarItem.map((item) => {
              const isExternal = item.url.startsWith('http');
              const target = isExternal ? '_blank' : undefined;
              return (
                <Link target={target} key={item.id} href={item.url}>
                  {l.en ? item.nameEn : item.nameSv}
                  {isExternal && <>&nbsp;&#8599;</>}
                </Link>
              );
            })}
          </DropdownLink>
        );
      })}
    </nav>
  );
};

export default Navigation;
