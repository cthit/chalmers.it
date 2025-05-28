import styles from './Header.module.scss';
import User from './User/User';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import NavDrawer from './NavDrawer/NavDrawer';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import Navigation from './Navigation/Navigation';
import SearchIcon from './SearchBar/SearchIcon';
import Link from 'next/link';

const Header = ({ locale }: { locale: string }) => {
  return (
    <header className={styles.header}>
      <div className={styles.mobile}>
        <NavDrawer>
          <User locale={locale} className={styles.mobileUser} />
          <Navigation locale={locale} desktop={false} />
          <div className={styles.mobileActions}>
            <ThemeSelector />
            <Link href="/post/search">
              <SearchIcon />
            </Link>
          </div>
        </NavDrawer>
        <EscapeHatch locale={locale} />
      </div>
      <div className={styles.desktop}>
        <EscapeHatch locale={locale} />
        <div>
          <Navigation locale={locale} desktop />
        </div>
        <div className={styles.right}>
          <SearchSwitcher />
          <ThemeSelector className={styles.selector} />
          <User locale={locale} />
        </div>
      </div>
    </header>
  );
};

export default Header;
