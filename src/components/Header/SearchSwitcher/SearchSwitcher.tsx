'use client';

import SearchBar from '../SearchBar/SearchBar';
import SearchIcon from '../SearchBar/SearchIcon';
import styles from '../Header.module.scss';
import EscapeHatch from '../EscapeHatch/EscapeHatch';
import { useState } from 'react';

const SearchSwitcher = () => {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <div className={styles.right}>
        {showSearch ? <SearchBar /> : null}
        {<SearchIcon onClick={() => setShowSearch(!showSearch)} />}
      </div>
    </>
  );
};

export default SearchSwitcher;
