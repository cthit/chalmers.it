import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContactCard from '@/components/ContactCard/ContactCard';
import DivisionNavigation from '@/components/DivisionNavigation/DivisionNavigation';

export default async function Groups({
  params: { locale }
}: {
  params: { locale: string };
}) {
  return (
    <main>
      <ThreePaneLayout
        middle={<DivisionNavigation locale={locale} />}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
