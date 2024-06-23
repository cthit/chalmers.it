import ActionLink from '@/components/ActionButton/ActionLink';
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
      title={l.docs.operational}
      titleSide={
        <GroupActive>
          <ActionLink href="/documents/new">{l.general.upload}</ActionLink>
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
                {l.docTypes[DivisionDocumentService.documentTypeKey(doc.type)]}
              </h4>
              <p className={styles.subtitle}>
                {`${l.general.uploaded} ${i18nService.formatDate(doc.createdAt, false)}`}
                {` ${l.news.for} ${doc.divisionGroupName}`}
              </p>
              <p>{en ? doc.descriptionEn : doc.descriptionSv}</p>
              <GroupActive group={doc.gammaSuperGroupId}>
                <DeleteDocumentButton locale={locale} id={doc.id} />
              </GroupActive>{' '}
              <ActionLink href={doc.url}>{l.general.download}</ActionLink>
            </ContentPane>
          </li>
        ))}
      </ul>
    </ContentArticle>
  );
};
