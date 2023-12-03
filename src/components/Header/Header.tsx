import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import Navigation from './Navigation/Navigation';
import User from './User/User';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import Search from './SearchBar/Search';

const Header = () => {
  return (
    <header className={styles.header}>
      <EscapeHatch />
      <Navigation />
      <Search />
      <ThemeSelector />
      <User />
    </header>
  );
};

export default Header;
