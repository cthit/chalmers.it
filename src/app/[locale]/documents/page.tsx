import ActionButton from '@/components/ActionButton/ActionButton';
import ContentPane from '@/components/ContentPane/ContentPane';
import Divider from '@/components/Divider/Divider';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionDocumentService from '@/services/divisionDocumentService';
import style from './page.module.scss';

export default async function Page() {
  return (
    <main>
      <ThreePaneLayout middle={await mainContent()} />
    </main>
  );
}

const mainContent = async () => {
  const documents = await DivisionDocumentService.get();
  return (
    <ContentPane>
      <h1>Dokument</h1>
      <h3>Se fler dokument på dokument.chalmers.it</h3>
      <ActionButton href="/documents/new">Ladda upp</ActionButton>
      <Divider />
      <ul className={style.documentList}>
        {documents.map((document) => (
          <li key={document.id}>
            <ContentPane>
              <h3>{document.title}</h3>
              <p>Uppladdad av {document.divisionGroupName}</p>
              <p>{document.description}</p>
              <ActionButton href={document.url}>Ladda ner</ActionButton>
            </ContentPane>
          </li>
        ))}
      </ul>
    </ContentPane>
  );
};
