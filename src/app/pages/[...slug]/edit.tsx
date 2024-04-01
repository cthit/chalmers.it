import ContentPane from '@/components/ContentPane/ContentPane';
import DivisionPageForm from '@/components/DivisionPageForm/DivisionPageForm';
import DivisionPageService from '@/services/divisionPageService';

export default async function editContent(slug: string[]) {
  slug.length -= 1;
  const pages = await DivisionPageService.get();
  const page = DivisionPageService.findBySlug(slug, pages)!;
  return (
    <main>
      <ContentPane>
        <DivisionPageForm
          pages={pages}
          editedId={page.id}
          parentId={page.parent}
          slug={page.completeSlug[page.completeSlug.length - 1]}
          titleEn={page.titleEn}
          titleSv={page.titleSv}
          contentEn={page.contentEn}
          contentSv={page.contentSv}
        />
      </ContentPane>
    </main>
  );
}
