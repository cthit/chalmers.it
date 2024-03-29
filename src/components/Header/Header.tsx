import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import User from './User/User';

const Header = () => {
  return (
    <header className={styles.header}>
      <EscapeHatch />
      <SearchSwitcher />
      <ThemeSelector />
      <User />
    </header>
  );
};

export default Header;
