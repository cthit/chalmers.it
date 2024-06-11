'use client';

import SearchBar from '../SearchBar/SearchBar';
// import SearchIcon from '../SearchBar/SearchIcon';
import styles from '../Header.module.scss';
import EscapeHatch from '../EscapeHatch/EscapeHatch';
import Navigation from '../Navigation/Navigation';
//import { useState } from 'react';

const SearchSwitcher = ({
  children,
  locale
}: {
  children: React.ReactNode;
  locale: string;
}) => {
  //const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <EscapeHatch locale={locale} />
      {/*showSearch*/ false ? (
        <SearchBar />
      ) : (
        <Navigation locale={locale} desktop={true} />
      )}
      <div className={styles.right}>
        {/*<SearchIcon onClick={() => setShowSearch(!showSearch)} />*/}
        {children}
      </div>
    </>
  );
};

export default SearchSwitcher;
