import ActionButton from '@/components/ActionButton/ActionButton';
import ContentPane from '@/components/ContentPane/ContentPane';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionDocumentService from '@/services/divisionDocumentService';
import styles from './page.module.scss';
import ContentArticle from '@/components/ContentArticle/ContentArticle';
import i18nService from '@/services/i18nService';
import DeleteDocumentButton from './DeleteDocumentButton';
import GroupActive from '@/components/Protected/GroupActive';

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
      subtitle={'Se fler dokument på docs.chalmers.it'}
      titleSide={
        <GroupActive>
          <ActionButton href="/documents/new">Ladda upp</ActionButton>
        </GroupActive>
      }
    >
      <ul className={styles.documentList}>
        {documents.length === 0 && <p>Inga dokument att visa</p>}
        {documents.map((doc) => (
          <li key={doc.id}>
            <ContentPane>
              <h3 className={styles.title}>{doc.title}</h3>{' '}
              <h4 className={styles.docType}>
                {DivisionDocumentService.documentPrettyType(doc.type)}
              </h4>
              <p className={styles.subtitle}>
                Uppladdad {i18nService.formatDate(doc.createdAt, false)} av{' '}
                {doc.divisionGroupName}
              </p>
              <p>{doc.description}</p>
              <GroupActive group={doc.gammaSuperGroupId}>
                <DeleteDocumentButton id={doc.id} />
              </GroupActive>{' '}
              <ActionButton href={doc.url}>Ladda ner</ActionButton>
            </ContentPane>
          </li>
        ))}
      </ul>
    </ContentArticle>
  );
};
