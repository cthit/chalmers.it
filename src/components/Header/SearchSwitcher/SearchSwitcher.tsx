'use client';

import { useState } from 'react';
import Navigation from '../Navigation/Navigation';
import Search from '../SearchBar/Search';

const SearchSwitcher = ({ locale }: { locale?: string }) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  return (
    <>
      {isSearchExpanded ? null : <Navigation locale={locale} />}
      <Search
        onSearchIconClick={handleSearchIconClick}
        isExpanded={isSearchExpanded}
      />
    </>
  );
};

export default SearchSwitcher;
