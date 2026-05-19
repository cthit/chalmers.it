import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionPage from '@/components/DivisionPage/DivisionPage';
import ContactCard from '@/components/ContactCard/ContactCard';
import DivisionPageService from '@/services/divisionPageService';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await props.params;

  const page = await DivisionPageService.getBySlug(slug);
  if (page === undefined) {
    notFound();
  }

  const isEn = locale === 'en';

  return {
    title: isEn ? page.titleEn : page.titleSv
  };
}

export default async function Page(props: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await props.params;

  const main = DivisionPage(locale, slug);
  const left = (
    <DivisionNavigation locale={locale} visitedSlug={['/pages', ...slug]} />
  );
  const right = <ContactCard locale={locale} />;

  return <ThreePaneLayout left={left} middle={await main} right={right} />;
}
