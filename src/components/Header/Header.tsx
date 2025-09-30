import styles from './Header.module.scss';
import User from './User/User';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import NavDrawer from './NavDrawer/NavDrawer';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import Navigation from './Navigation/Navigation';
import SearchIcon from './SearchBar/SearchIcon';
import Link from 'next/link';
import LanguageToggle from './LanguageToggle/LanguageToggle';

const Header = ({ locale }: { locale: string }) => {
  return (
    <header className={styles.header}>
      <div className={styles.mobile}>
        <NavDrawer>
          <User locale={locale} className={styles.mobileUser} />
          <Navigation locale={locale} desktop={false} />
          <div className={styles.mobileActions}>
            <LanguageToggle locale={locale} />
            <ThemeSelector />
            <Link href="/post/search">
              <SearchIcon />
            </Link>
          </div>
        </NavDrawer>
        <EscapeHatch locale={locale} />
      </div>
      <div className={styles.desktop}>
        <SearchSwitcher
          locale={locale}
          nav={<Navigation locale={locale} desktop />}
        >
          <ThemeSelector className={styles.selector} />
          <LanguageToggle locale={locale} />
          <User locale={locale} />
        </SearchSwitcher>
      </div>
    </header>
  );
};

export default Header;
