import styles from './SearchBar.module.scss';

const SearchBar = () => {
  return (
    <input
      className={styles.expandedSearchBar}
      type="text"
      placeholder="Search..."
    />
  );
};

export default SearchBar;
