import styles from './SearchBar.module.scss';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const router = useRouter();
  return (
    <input
      className={styles.expandedSearchBar}
      type="text"
      placeholder="Search..."
      onKeyDown={(e) => {
        if (e.key === 'Enter')
          router.push(`/post/search?q=${e.currentTarget.value}`);
      }}
    />
  );
};

export default SearchBar;
