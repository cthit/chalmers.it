import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import Navigation from './Navigation/Navigation';
import User from './User/User';
import ThemeSelector from './ThemeSelector/ThemeSelector';

const Header = () => {
  return (
    <header className={styles.header}>
      <EscapeHatch />
      <Navigation />
      <ThemeSelector />
      <User />
    </header>
  );
};

export default Header;
