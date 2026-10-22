import { useState, useRef, useEffect } from 'react';
import styles from './SearchBar.module.scss';
import { useRouter } from 'next/navigation';
import i18nService from '@/services/i18nService';

const SearchBar = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const router = useRouter();
  const [term, setTerm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <form
      className={styles.searchBarForm}
      onSubmit={(e) => {
        e.preventDefault();
        if (term.trim() === '') router.push('/post/search');
        else router.push(`/post/search?q=${term}`);
      }}
    >
      <input
        className={styles.expandedSearchBar}
        type="text"
        placeholder={l.search.newsPlaceholder}
        aria-label={l.search.newsPlaceholder}
        ref={inputRef}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
