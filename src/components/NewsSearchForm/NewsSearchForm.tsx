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

type ResultsType = Awaited<ReturnType<typeof search>> | undefined;

const NewsSearchForm = ({
  locale,
  groups,
  initialQuery,
  initialBefore,
  initialAfter,
  initialResults,
  initialGroup,
  initialUser
}: {
  locale: string;
  groups: [string, string][];
  initialQuery: string;
  initialBefore?: Date;
  initialAfter?: Date;
  initialGroup?: string;
  initialUser?: string;
  initialResults?: ResultsType;
}) => {
  const l = i18nService.getLocale(locale);

  const [results, setResults] = useState<ResultsType | null>(initialResults);
  const [query, setQuery] = useState(initialQuery);
  const [before, setBefore] = useState<Date | undefined>(initialBefore);
  const [after, setAfter] = useState<Date | undefined>(initialAfter);
  const [groupId, setGroupId] = useState<string | undefined>(initialGroup);

  const onSearch = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setResults(undefined);

      const isValidQuery =
        query.length >= 3 || groupId !== undefined || initialUser !== undefined;
      setResults(
        isValidQuery
          ? await search(locale, query, before, after, initialUser, groupId)
          : null
      );

      const searchParams = new URLSearchParams();
      if (query) searchParams.append('q', query);
      if (before && !isNaN(before.getTime()))
        searchParams.append('before', before.getTime().toString());
      if (after && !isNaN(after.getTime()))
        searchParams.append('after', after.getTime().toString());
      if (groupId) searchParams.append('gid', groupId);
      if (initialUser) searchParams.append('uid', initialUser);

      window.history.pushState(
        {},
        '',
        '/post/search?' + searchParams.toString()
      );
    },
    [query, locale, before, after, initialUser, groupId]
  );

  useEffect(() => {
    setQuery(initialQuery);
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
              value={groupId}
            >
              <option value={''}>{l.search.allGroups}</option>
              {groups.map(([name, id]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </DropdownList>
          </div>
          <ActionButton className={styles.submit} type="submit">
            {l.search.search}
          </ActionButton>
        </form>
      </ContentPane>
      <br />
      <ContentPane>
        <h1>{l.search.results}</h1>
        <Divider />
        {results === undefined && <p>{l.search.loading}</p>}
        {results === null && <p>{l.search.short}</p>}
        {results?.length === 0 && <p>{l.search.empty}</p>}
        <ul className={styles.results}>
          {results &&
            results.length > 0 &&
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
