'use client';

import { useState } from 'react';
import Navigation from '../Navigation/Navigation';
import Search from '../SearchBar/Search';

const SearchSwitcher = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  return (
    <>
      {isSearchExpanded ? null : <Navigation />}
      <Search
        onSearchIconClick={handleSearchIconClick}
        isExpanded={isSearchExpanded}
      />
    </>
  );
};

export default SearchSwitcher;
