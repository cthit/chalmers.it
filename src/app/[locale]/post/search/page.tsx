import { search } from '@/actions/search';
import ContactCard from '@/components/ContactCard/ContactCard';
import NewsSearchForm from '@/components/NewsSearchForm/NewsSearchForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const initialResults = await search('');

  return (
    <main>
      <ThreePaneLayout
        left={<></>}
        middle={<NewsSearchForm initialResults={initialResults} />}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
