'use client';

import styles from './NewsSearchForm.module.scss';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import ActionButton from '../ActionButton/ActionButton';
import ContentPane from '../ContentPane/ContentPane';
import DatePicker from '../DatePicker/DatePicker';
import Divider from '../Divider/Divider';
import TextArea from '../TextArea/TextArea';
import { search } from '@/actions/newsList';
import i18nService from '@/services/i18nService';
import NewsSearchResult from './NewsSearchResult/NewsSearchResult';

const NewsSearchForm = ({
  locale,
  initialQuery,
  initialResults
}: {
  locale: string;
  initialQuery: string;
  initialResults?: Awaited<ReturnType<typeof search>>;
}) => {
  const l = i18nService.getLocale(locale);

  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(initialQuery);
  const [searchedQuery, setSearchedQuery] = useState(initialQuery);
  const [before, setBefore] = useState<Date | undefined>(undefined);
  const [after, setAfter] = useState<Date | undefined>(undefined);

  const validLength = searchedQuery.length >= 3;

  const onSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setResults(undefined);

      const isValidLength = query.length >= 3;
      setSearchedQuery(query);
      setResults(
        isValidLength ? await search(query, locale, before, after) : []
      );
    },
    [query, locale, before, after]
  );

  useEffect(() => {
    setQuery(initialQuery);
    setSearchedQuery(initialQuery);
    setResults(initialResults);
  }, [initialQuery, initialResults]);

  return (
    <>
      <ContentPane>
        <form onSubmit={onSearch}>
          <h1>{l.search.search}</h1>
          <Divider />
          <label>{l.search.query}</label>
          <TextArea value={query} onChange={(e) => setQuery(e.target.value)} />
          <br />
          <label>{l.search.before}</label>
          <br />
          <DatePicker value={before} onChange={setBefore} />
          <br />
          <label>{l.search.after}</label>
          <br />
          <DatePicker value={after} onChange={setAfter} />
          <br />
          <ActionButton type="submit">{l.search.search}</ActionButton>
        </form>
      </ContentPane>
      <br />
      <ContentPane>
        <h1>{l.search.results}</h1>
        <Divider />
        {results === undefined && <p>{l.search.loading}</p>}
        {results !== undefined &&
          results.length === 0 &&
          (validLength ? <p>{l.search.empty}</p> : <p>{l.search.short}</p>)}
        <ul className={styles.results}>
          {results !== undefined &&
            results.map((result) => (
              <li key={result!.id}>
                <NewsSearchResult post={result} locale={locale} />
              </li>
            ))}
        </ul>
      </ContentPane>
    </>
  );
};

export default NewsSearchForm;
