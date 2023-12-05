'use client';

import React, { useState } from 'react';
import styles from './Header.module.scss';
import EscapeHatch from './EscapeHatch/EscapeHatch';
import Navigation from './Navigation/Navigation';
import User from './User/User';
import ThemeSelector from './ThemeSelector/ThemeSelector';
import Search from './SearchBar/Search';

const Header = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  return (
    <header className={styles.header}>
      <EscapeHatch />
      {isSearchExpanded ? null : <Navigation />}
      <div>
        <Search
          onSearchIconClick={handleSearchIconClick}
          isExpanded={isSearchExpanded}
        />
      </div>
      <ThemeSelector />
      <User />
    </header>
  );
};

export default Header;
