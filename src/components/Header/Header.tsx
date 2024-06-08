import styles from './Header.module.scss';
import User from './User/User';
import SearchSwitcher from './SearchSwitcher/SearchSwitcher';
import ThemeSelector from './ThemeSelector/ThemeSelector';

const Header = ({ locale }: { locale: string }) => {
  return (
    <header className={styles.header}>
      <SearchSwitcher locale={locale}>
        <ThemeSelector />
        <User locale={locale} />
      </SearchSwitcher>
    </header>
  );
};

export default Header;
