import styles from './Header.module.scss';
import User from './User/User';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import NavDrawer from './NavDrawer/NavDrawer';
import EscapeHatch from './EscapeHatch/EscapeHatch';

const Header = ({ locale }: { locale: string }) => {
  return (
    <header className={styles.header}>
      <div className={`${styles.mobile}`}>
        <NavDrawer>
          <User locale={locale} />
          <ThemeSelector />
        </NavDrawer>
      </div>
      <EscapeHatch />
      <div className={`${styles.desktop} ${styles.header}`}>
        <SearchSwitcher locale={locale}>
          <ThemeSelector />
          <User locale={locale} />
        </SearchSwitcher>
      </div>
    </header>
  );
};

export default Header;
