import Divider from '@/components/Divider/Divider';
import AddDocumentForm from './AddDocumentForm';
import SessionService from '@/services/sessionService';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContentPane from '@/components/ContentPane/ContentPane';
import i18nService from '@/services/i18nService';
import Forbidden from '@/components/ErrorPages/403/403';
import ContactCard from '@/components/ContactCard/ContactCard';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  const groups = await SessionService.getActiveAddedGroups();
  if (groups.length === 0) {
    return <Forbidden />;
  }

  const l = i18nService.getLocale(locale);

  return (
    <main>
      <ThreePaneLayout
        middle={
          <ContentPane>
            <h1>{l.docs.createNew}</h1>
            <Divider />
            <AddDocumentForm groups={groups} locale={locale} />
          </ContentPane>
        }
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}
