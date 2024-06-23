import DivisionPageService from '@/services/divisionPageService';
import ContentArticle from '@/components/ContentArticle/ContentArticle';
import DeletePageButton from './DeletePageButton/DeletePageButton';
import ContentPane from '../ContentPane/ContentPane';
import DivisionPageForm from '../DivisionPageForm/DivisionPageForm';
import SessionService from '@/services/sessionService';
import i18nService from '@/services/i18nService';
import ActionLink from '../ActionButton/ActionLink';
import { notFound } from 'next/navigation';
import MarkdownView from '../MarkdownView/MarkdownView';

export default async function DivisionPage(
  locale: string,
  slug: string[],
  id?: number,
  gammaSuperGroupId?: string
) {
  const isAdmin = await SessionService.isAdmin();
  const canEdit =
    id && gammaSuperGroupId
      ? await SessionService.canEditGroup(gammaSuperGroupId).catch(() => false)
      : isAdmin;

  const isEditing = slug[slug.length - 1] === 'edit';
  return isEditing && canEdit
    ? editContent(locale, slug, id)
    : mainContent(locale, slug, id, canEdit, canEdit || isAdmin);
}

async function mainContent(
  locale: string,
  slug: string[],
  id?: number,
  canEdit?: boolean,
  canDelete?: boolean
) {
  const page = await DivisionPageService.getBySlug(slug, id);
  if (page === undefined) {
    notFound();
  }

  const end = slug[slug.length - 1];
  const l = i18nService.getLocale(locale);
  const en = locale === 'en';

  const side = (
    <>
      {canEdit && (
        <ActionLink href={`./${end}/edit`}>{l.general.edit}</ActionLink>
      )}
      {canDelete && <DeletePageButton locale={locale} id={page.id} />}
    </>
  );

  return (
    <main>
      <ContentArticle
        title={en ? page?.titleEn : page?.titleSv}
        titleSide={side}
      >
        <MarkdownView content={en ? page?.contentEn : page?.contentSv} />
      </ContentArticle>
    </main>
  );
}

async function editContent(locale: string, slug: string[], id?: number) {
  slug.length -= 1;
  const pages = await DivisionPageService.get(id);

  const page = DivisionPageService.findBySlug(slug, pages)!;
  return (
    <main>
      <ContentPane>
        <DivisionPageForm
          pages={pages}
          editedId={page.id}
          parentId={page.parentId}
          slug={page.completeSlug[page.completeSlug.length - 1]}
          divisionGroupId={id}
          titleEn={page.titleEn}
          titleSv={page.titleSv}
          contentEn={page.contentEn}
          contentSv={page.contentSv}
          priority={page.priority}
          locale={locale}
        />
      </ContentPane>
    </main>
  );
}
