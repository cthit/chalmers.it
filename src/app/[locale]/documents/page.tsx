import ActionButton from '@/components/ActionButton/ActionButton';
import ContentPane from '@/components/ContentPane/ContentPane';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionDocumentService from '@/services/divisionDocumentService';
import style from './page.module.scss';
import ContentArticle from '@/components/ContentArticle/ContentArticle';

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
    <ContentArticle
      title={'Dokument'}
      subtitle={'Se fler dokument på dokument.chalmers.it'}
      titleSide={<ActionButton href="/documents/new">Ladda upp</ActionButton>}
    >
      <ul className={style.documentList}>
        {documents.length === 0 && <p>Inga dokument att visa</p>}
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
    </ContentArticle>
  );
};
