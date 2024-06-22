'use client';

import { useState } from 'react';
import ActionButton from '../ActionButton/ActionButton';
import ContentPane from '../ContentPane/ContentPane';
import Divider from '../Divider/Divider';
import TextArea from '../TextArea/TextArea';
import Link from 'next/link';
import { search } from '@/actions/search';
import { useSearchParams } from 'next/navigation';

const NewsSearchForm = ({ initialResults }: { initialResults: any[] }) => {
  const searchParams = useSearchParams().get('query') || '';

  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(searchParams);

  const onSearch = async () => {
    setResults(await search(query));
  };

  return (
    <>
      <ContentPane>
        <h1>Search</h1>
        <Divider />
        <label>Query</label>
        <TextArea value={query} onChange={(e) => setQuery(e.target.value)} />
        <br />
        <ActionButton onClick={onSearch}>Search</ActionButton>
      </ContentPane>
      <br />
      <ContentPane>
        <h1>Results</h1>
        <Divider />
        {results.length === 0 && <p>No results found.</p>}
        {results.map((result) => (
          <Link key={result.id} href={`/post/${result.id}`}>
            {result.titleEn}
          </Link>
        ))}
      </ContentPane>
    </>
  );
};

export default NewsSearchForm;
