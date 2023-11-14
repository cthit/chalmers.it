import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import Navigation from './Navigation/Navigation';
import User from './User/User';

const Header = () => {
  return (
    <header className={styles.header}>
      <EscapeHatch />
      <Navigation />
      <User />
    </header>
  );
};

export default Header;
