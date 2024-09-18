import { search } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import NewsSearchForm from '@/components/NewsSearchForm/NewsSearchForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';

export default async function Page({
  params: { locale },
  searchParams: { q }
}: {
  params: { locale: string };
  searchParams: { q?: string };
}) {
  const res = q !== undefined && q.length >= 3 ? await search(q, locale) : [];

  return (
    <main>
      <ThreePaneLayout
        middle={
          <NewsSearchForm
            locale={locale}
            initialQuery={q ?? ''}
            initialResults={res}
          />
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
