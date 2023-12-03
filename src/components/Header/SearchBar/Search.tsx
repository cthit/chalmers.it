'use client';

import React, { useState } from 'react';
import styles from './Search.module.scss';
import { BsSearchHeartFill } from 'react-icons/bs';

const Search = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleIconClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.searchBarContainer}>
      <BsSearchHeartFill className={styles.searchIcon} onClick={handleIconClick} />
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