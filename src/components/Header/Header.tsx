import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import User from './User/User';

const Header = async () => {
  return (
    <header className={styles.header}>
      <EscapeHatch />
      <SearchSwitcher />
      <ThemeSelector />
      {/* @ts-expect-error Server Component */}
      <User />
    </header>
  );
};

export default Header;
