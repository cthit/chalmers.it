import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import User from './User/User';
import NavDrawer from './NavDrawer/NavDrawer';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.mobile}`}>
        <NavDrawer>
          <User />
        </NavDrawer>
      </div>
      <EscapeHatch />
      <div className={`${styles.desktop} ${styles.header}`}>
        <SearchSwitcher />
        <ThemeSelector />
        <User />
      </div>
    </header>
  );
};

export default Header;
