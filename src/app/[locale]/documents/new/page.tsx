import Divider from '@/components/Divider/Divider';
import AddDocumentForm from './AddDocumentForm';
import SessionService from '@/services/sessionService';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import ContentPane from '@/components/ContentPane/ContentPane';

export default async function Page() {
  const groups = await SessionService.getActiveGroups();

  return (
    <main>
      <ThreePaneLayout
        middle={
          <ContentPane>
            <h1>Ladda upp dokument</h1>
            <Divider />
            <AddDocumentForm groups={groups} />
          </ContentPane>
        }
      />
    </main>
  );
}
