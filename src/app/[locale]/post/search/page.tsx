import { search } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import NewsSearchForm from '@/components/NewsSearchForm/NewsSearchForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';

export default async function Page({
  params: { locale },
  searchParams: { q, gid, uid, before, after }
}: {
  params: { locale: string };
  searchParams: {
    q?: string;
    gid?: string;
    uid?: string;
    before: string;
    after: string;
  };
}) {
  const validQuery =
    (q !== undefined && (q?.length ?? -1 >= 3)) ||
    gid !== undefined ||
    uid !== undefined;
  const verifiedBefore = !isNaN(+before) ? new Date(+before) : undefined;
  const verifiedAfter = !isNaN(+after) ? new Date(+after) : undefined;

  const res = validQuery
    ? await search(locale, q, verifiedBefore, verifiedAfter, uid, gid)
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
            initialBefore={verifiedBefore}
            initialAfter={verifiedAfter}
          />
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
