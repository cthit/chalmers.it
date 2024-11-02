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
import DropdownList from '../DropdownList/DropdownList';

const NewsSearchForm = ({
  locale,
  groups,
  initialQuery,
  initialResults,
  initialGroup,
  initialUser
}: {
  locale: string;
  groups: [string, string][];
  initialQuery: string;
  initialGroup?: string;
  initialUser?: string;
  initialResults?: Awaited<ReturnType<typeof search>>;
}) => {
  const l = i18nService.getLocale(locale);

  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(initialQuery);
  const [searchedQuery, setSearchedQuery] = useState(initialQuery);
  const [before, setBefore] = useState<Date | undefined>(undefined);
  const [after, setAfter] = useState<Date | undefined>(undefined);
  const [groupId, setGroupId] = useState<string | undefined>(initialGroup);

  const validQuery =
    searchedQuery.length >= 3 ||
    groupId !== undefined ||
    initialUser !== undefined;

  const onSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setResults(undefined);

      const isValidQuery =
        query.length >= 3 || groupId !== undefined || initialUser !== undefined;
      setSearchedQuery(query);
      setResults(
        isValidQuery
          ? await search(locale, query, before, after, initialUser, groupId)
          : []
      );
    },
    [query, locale, before, after, initialUser, groupId]
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
          <div>
            <label>{l.search.query}</label>
            <TextArea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div>
            <label>{l.search.before}</label>
            <br />
            <DatePicker value={before} onChange={setBefore} />
          </div>
          <label>{l.search.after}</label>
          <br />
          <DatePicker value={after} onChange={setAfter} />
          <div>
            <label>{l.search.group}</label>
            <br />
            <DropdownList
              onChange={(e) =>
                setGroupId(e.target.value !== '' ? e.target.value : undefined)
              }
            >
              <option value={''}>{l.search.allGroups}</option>
              {groups.map(([name, id]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </DropdownList>
          </div>
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
          (validQuery ? <p>{l.search.empty}</p> : <p>{l.search.short}</p>)}
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
