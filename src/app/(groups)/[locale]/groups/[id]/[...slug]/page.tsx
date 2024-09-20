import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';
import DivisionPage from '@/components/DivisionPage/DivisionPage';
import Card from '@/components/ContactCard/ContactCard';

export default async function Page({
  params
}: {
  params: { locale: string; id: string; slug: string[] };
}) {
  const group = (await DivisionGroupService.getInfoBySlug(params.id))!;

  const main = DivisionPage(params.locale, params.slug, group.id);
  const left = (
    <DivisionNavigation
      locale={params.locale}
      visitedSlug={['/groups', params.id, ...params.slug]}
    />
  );
  const right = <ContactCard locale={params.locale} />;

  return <ThreePaneLayout left={left} middle={await main} right={right} />;
}
