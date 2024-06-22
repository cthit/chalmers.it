import ContactCard from '@/components/ContactCard/ContactCard';
import NewsSearchForm from '@/components/NewsSearchForm/NewsSearchForm';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  return (
    <main>
      <ThreePaneLayout
        left={<></>}
        middle={<NewsSearchForm />}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
