import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import User from './User/User';

const Header = ({ locale }: { locale: string }) => {
  return (
    <header className={styles.header}>
      <EscapeHatch locale={locale} />
      <SearchSwitcher locale={locale} />
      <ThemeSelector />
      <User locale={locale} />
    </header>
  );
};

export default Header;
