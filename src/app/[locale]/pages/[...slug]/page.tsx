import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionPage from '@/components/DivisionPage/DivisionPage';
import ContactCard from '@/components/ContactCard/ContactCard';

export default async function Page({
  params: { locale, slug }
}: {
  params: { locale: string; slug: string[] };
}) {
  const main = DivisionPage(locale, slug);
  const left = (
    <DivisionNavigation locale={locale} visitedSlug={['/pages', ...slug]} />
  );
  const right = <ContactCard locale={locale} />;

  return <ThreePaneLayout left={left} middle={await main} right={right} />;
}
