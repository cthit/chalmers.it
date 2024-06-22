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

const NewsSearchForm = () => {
  const searchParams = useSearchParams().get('query') || '';

  const [results, setResults] = useState<any[] | undefined>(undefined);
  const [query, setQuery] = useState(searchParams);
  const [before, setBefore] = useState<Date | undefined>(undefined);
  const [after, setAfter] = useState<Date | undefined>(undefined);

  const onSearch = async () => {
    setResults(undefined);
    setResults(await search(query, before, after));
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <>
      <ContentPane>
        <h1>Search</h1>
        <Divider />
        <label>Query</label>
        <TextArea value={query} onChange={(e) => setQuery(e.target.value)} />
        <br />
        <label>After</label>
        <br />
        <DatePicker value={after} onChange={setAfter} />
        <br />
        <label>Before</label>
        <br />
        <DatePicker value={before} onChange={setBefore} />
        <br />
        <ActionButton onClick={onSearch}>Search</ActionButton>
      </ContentPane>
      <br />
      <ContentPane>
        <h1>Results</h1>
        <Divider />
        {results === undefined && <p>Loading...</p>}
        {results !== undefined && results.length === 0 && (
          <p>No results found.</p>
        )}
        {results !== undefined &&
          results.map((result) => (
            <Link key={result.id} href={`/post/${result.id}`}>
              {result.titleEn}
            </Link>
          ))}
      </ContentPane>
    </>
  );
};

export default NewsSearchForm;
