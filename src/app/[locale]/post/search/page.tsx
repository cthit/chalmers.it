import { search } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import NewsSearchForm from '@/components/NewsSearchForm/NewsSearchForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';

export default async function Page({
  params: { locale },
  searchParams: { q, gid, uid }
}: {
  params: { locale: string };
  searchParams: { q?: string; gid?: string; uid?: string };
}) {
  const validQuery =
    (q !== undefined && (q?.length ?? -1 >= 3)) ||
    gid !== undefined ||
    uid !== undefined;
  const res = validQuery
    ? await search(locale, q, undefined, undefined, uid, gid)
    : [];

  return (
    <main>
      <ThreePaneLayout
        middle={
          <NewsSearchForm
            locale={locale}
            initialQuery={q ?? ''}
            initialResults={res}
            groups={[]}
            initialGroup={gid}
            initialUser={uid}
          />
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
