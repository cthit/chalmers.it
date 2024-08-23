'use client';

import SearchBar from '../SearchBar/SearchBar';
import styles from '../Header.module.scss';
import EscapeHatch from '../EscapeHatch/EscapeHatch';
import Navigation from '../Navigation/Navigation';

const SearchSwitcher = ({
  children,
  locale
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  return (
    <>
      <EscapeHatch locale={locale} />
      <Navigation locale={locale} desktop={true} />

      <div className={styles.right}>
        <SearchBar />
        {children}
      </div>
    </>
  );
};

export default SearchSwitcher;
