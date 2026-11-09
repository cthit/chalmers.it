import { search } from '@/actions/newsList';
import ContactCard from '@/components/ContactCard/ContactCard';
import NewsSearchForm from '@/components/NewsSearchForm/NewsSearchForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';
import { isValidQuery } from '@/utils/query';
import { EventLanguage } from '@prisma/client';

export default async function Page(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    gid?: string;
    uid?: string;
    before: string;
    after: string;
    lang?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const { q, gid, uid, before, after, lang } = searchParams;

  const params = await props.params;

  const { locale } = params;

  const verifiedBefore = !isNaN(+before) ? new Date(+before) : undefined;
  const verifiedAfter = !isNaN(+after) ? new Date(+after) : undefined;
  const verifiedEventLanguage: EventLanguage | undefined =
    EventLanguage[lang?.toUpperCase() as EventLanguage];
  const validQuery = isValidQuery({
    query: q,
    groupId: gid,
    userId: uid,
    eventLanguage: verifiedEventLanguage
  });

  const res = validQuery
    ? await search(
        locale,
        q,
        verifiedBefore,
        verifiedAfter,
        uid,
        gid,
        verifiedEventLanguage
      )
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
            initialEventLanguage={verifiedEventLanguage}
          />
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
