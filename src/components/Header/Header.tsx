import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import Navigation from './Navigation/Navigation';

const Header = () => {
  return (
    <header className={styles.header}>
      <EscapeHatch />
      <Navigation />
    </header>
  );
};

export default Header;
