import ActionLink from '@/components/ActionButton/ActionLink';
import ContentPane from '@/components/ContentPane/ContentPane';
import ThreePaneLayout from '@/components/ThreePaneLayout/ThreePaneLayout';
import DivisionDocumentService, {
  DivisionDocument
} from '@/services/divisionDocumentService';
import styles from './page.module.scss';
import ContentArticle from '@/components/ContentArticle/ContentArticle';
import i18nService from '@/services/i18nService';
import DeleteDocumentButton from './DeleteDocumentButton';
import GroupActive from '@/components/Protected/GroupActive';
import ContactCard from '@/components/ContactCard/ContactCard';
import FilterDocumentsForm from './FilterDocumentsForm';
import DivisionGroupService from '@/services/divisionGroupService';
import { DocumentType } from '@prisma/client';

export default async function Page(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; gid?: string; type?: string }>;
}) {
  const searchParams = await props.searchParams;

  const { q, gid, type } = searchParams;

  const params = await props.params;

  const { locale } = params;

  const groups = await DivisionGroupService.getAll();

  const validType =
    type === undefined ||
    Object.values(DocumentType).includes(type as DocumentType);
  const documents = validType
    ? await DivisionDocumentService.filter(locale, q, gid, type as DocumentType)
    : [];

  return (
    <main>
      <ThreePaneLayout
        left={<FilterDocumentsForm locale={locale} groups={groups} />}
        middle={await mainContent(locale, documents)}
        right={<ContactCard locale={locale} />}
      />
    </main>
  );
}

const mainContent = async (locale: string, documents: DivisionDocument[]) => {
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
                {`${l.docs.adActa} ${doc.divisionGroupName}`}
                {` ${i18nService.formatDate(doc.createdAt, false)}`}
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
