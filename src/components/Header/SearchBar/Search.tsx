'use client';

import React, { useState } from 'react';
import styles from './Search.module.scss';
import { BsSearchHeartFill } from 'react-icons/bs';

interface SearchProps {
  onSearchIconClick: () => void;
  isExpanded: boolean;
}

const Search: React.FC<SearchProps> = ({ onSearchIconClick, isExpanded }) => {
  return (
    <div className={styles.searchBarContainer}>
      <BsSearchHeartFill
        className={styles.searchIcon}
        onClick={onSearchIconClick}
      />
      {isExpanded && (
        <input
          className={styles.expandedSearchBar}
          type="text"
          placeholder="Search..."
        />
      )}
    </div>
  );
};

export default Search;
