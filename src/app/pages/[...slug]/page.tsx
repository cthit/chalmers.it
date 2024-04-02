import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionPage from '@/components/DivisionPage/DivisionPage';

export default async function Page({ params }: { params: { slug: string[] } }) {
  const main = DivisionPage(params.slug);
  const left = <DivisionNavigation />;
  const right = <div></div>;

  return <ThreePaneLayout left={left} middle={await main} right={right} />;
}
