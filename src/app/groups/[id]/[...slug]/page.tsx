import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionGroupService from '@/services/divisionGroupService';
import DivisionPage from '@/components/DivisionPage/DivisionPage';

export default async function Page({
  params
}: {
  params: { id: string; slug: string[] };
}) {
  const group = (await DivisionGroupService.getInfoBySlug(params.id))!;

  const main = DivisionPage(params.slug, group.id);
  const left = <DivisionNavigation />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={await main} right={right} />;
}
