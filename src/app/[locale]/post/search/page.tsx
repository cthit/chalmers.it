import { search } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import NewsSearchForm from '@/components/NewsSearchForm/NewsSearchForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';

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
  const groups = (await DivisionGroupService.getAll()).map((g) => [
    g.prettyName,
    g.gammaSuperGroupId
  ]) as [string, string][];

  return (
    <main>
      <ThreePaneLayout
        middle={
          <NewsSearchForm
            locale={locale}
            initialQuery={q ?? ''}
            initialResults={res}
            groups={groups}
            initialGroup={gid}
            initialUser={uid}
          />
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
