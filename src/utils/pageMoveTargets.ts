import type { DivisionPage } from '@/services/divisionPageService';

export function checkValidMoveTargets(
  pages: DivisionPage[],
  maxDepth: number,
  editedId?: number
) {
  const forbiddenIds = editedId ? [editedId] : [];
  const editedPage = pages.find((p) => p.id === editedId);
  const editedMoveDepth = editedPage
    ? editedPage.deepestChild - editedPage.depth
    : 0;

  for (const page of pages) {
    if (
      page.depth + editedMoveDepth >= maxDepth ||
      (page.parentId && forbiddenIds.includes(page.parentId))
    ) {
      forbiddenIds.push(page.id);
    }
  }
  return pages.map((p) => ({
    ...p,
    disabled: forbiddenIds.includes(p.id)
  }));
}
