'use client';

import { useEffect, useState } from 'react';
import ActionButton from '../ActionButton/ActionButton';
import ContentPane from '../ContentPane/ContentPane';
import DatePicker from '../DatePicker/DatePicker';
import Divider from '../Divider/Divider';
import TextArea from '../TextArea/TextArea';
import Link from 'next/link';
import { search } from '@/actions/search';
import { useSearchParams } from 'next/navigation';
import i18nService from '@/services/i18nService';

const NewsSearchForm = ({ locale }: { locale: string }) => {
  const l = i18nService.getLocale(locale);
  const searchParams = useSearchParams().get('q') || '';

  const [results, setResults] = useState<any[] | undefined>(undefined);
  const [query, setQuery] = useState(searchParams);
  const [before, setBefore] = useState<Date | undefined>(undefined);
  const [after, setAfter] = useState<Date | undefined>(undefined);

  const onSearch = async () => {
    setResults(undefined);
    setResults(await search(query, locale, before, after));
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <>
      <ContentPane>
        <h1>{l.search.search}</h1>
        <Divider />
        <label>{l.search.query}</label>
        <TextArea value={query} onChange={(e) => setQuery(e.target.value)} />
        <br />
        <label>{l.search.after}</label>
        <br />
        <DatePicker value={after} onChange={setAfter} />
        <br />
        <label>{l.search.before}</label>
        <br />
        <DatePicker value={before} onChange={setBefore} />
        <br />
        <ActionButton onClick={onSearch}>{l.search.search}</ActionButton>
      </ContentPane>
      <br />
      <ContentPane>
        <h1>{l.search.results}</h1>
        <Divider />
        {results === undefined && <p>{l.search.loading}</p>}
        {results !== undefined && results.length === 0 && (
          <p>{l.search.empty}</p>
        )}
        {results !== undefined &&
          results.map((result) => (
            <Link key={result.id} href={`/post/${result.id}`}>
              {l.en ? result.titleEn : result.titleSv}
            </Link>
          ))}
      </ContentPane>
    </>
  );
};

export default NewsSearchForm;
