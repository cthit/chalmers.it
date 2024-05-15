import ActionButton from '@/components/ActionButton/ActionButton';
import ContentPane from '@/components/ContentPane/ContentPane';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionDocumentService from '@/services/divisionDocumentService';
import styles from './page.module.scss';
import ContentArticle from '@/components/ContentArticle/ContentArticle';
import i18nService from '@/services/i18nService';
import DeleteDocumentButton from './DeleteDocumentButton';
import GroupActive from '@/components/Protected/GroupActive';
import ContactCard from '@/components/ContactCard/ContactCard';

export default async function Page({
  params: { locale }
}: {
  params: { locale: string };
}) {
  return (
    <main>
      <ThreePaneLayout
        middle={await mainContent(locale)}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}

const mainContent = async (locale: string) => {
  const documents = await DivisionDocumentService.get();
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';
  return (
    <ContentArticle
      title={l.docs.title}
      subtitle={l.docs.more}
      titleSide={
        <GroupActive>
          <ActionButton href="/documents/new">{l.general.upload}</ActionButton>
        </GroupActive>
      }
    >
      <ul className={styles.documentList}>
        {documents.length === 0 && <p>{l.docs.empty}</p>}
        {documents.map((doc) => (
          <li key={doc.id}>
            <ContentPane>
              <h3 className={styles.title}>{en ? doc.titleEn : doc.titleSv}</h3>{' '}
              <h4 className={styles.docType}>
                {DivisionDocumentService.documentPrettyType(doc.type)}
              </h4>
              <p className={styles.subtitle}>
                {`${l.general.uploaded} ${i18nService.formatDate(doc.createdAt, false)}`}
                {` ${l.news.by} ${doc.divisionGroupName}`}
              </p>
              <p>{en ? doc.descriptionEn : doc.descriptionSv}</p>
              <GroupActive group={doc.gammaSuperGroupId}>
                <DeleteDocumentButton text={l.general.delete} id={doc.id} />
              </GroupActive>{' '}
              <ActionButton href={doc.url}>{l.general.download}</ActionButton>
            </ContentPane>
          </li>
        ))}
      </ul>
    </ContentArticle>
  );
};
