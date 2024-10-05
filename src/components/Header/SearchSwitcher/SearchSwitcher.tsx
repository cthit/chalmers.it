'use client';

import SearchBar from '../SearchBar/SearchBar';
import SearchIcon from '../SearchBar/SearchIcon';
import styles from '../Header.module.scss';
import EscapeHatch from '../EscapeHatch/EscapeHatch';
import { useState } from 'react';

const SearchSwitcher = ({
  children,
  nav,
  locale
}: {
  children: React.ReactNode;
  nav: React.ReactNode;
  locale: string;
}) => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <EscapeHatch locale={locale} />
      {showSearch ? <SearchBar /> : nav}
      <div className={styles.right}>
        {<SearchIcon onClick={() => setShowSearch(!showSearch)} />}
        {children}
      </div>
    </>
  );
};

export default SearchSwitcher;
