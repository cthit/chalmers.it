import prisma from '@/prisma';

export type DivisionPage = {
  id: number;
  parentId?: number;
  titleEn: string;
  titleSv: string;
  contentEn: string;
  contentSv: string;
  completeSlug: string[];
  depth: number;
  deepestChild: number;
};

function arrayEquals(a: any[], b: any[]) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

export default class DivisionPageService {
  static async getAll() {
    return prisma.divisionGroup.findMany();
  }

  private static flattenPages(pages: any[]) {
    const result: { [key: number]: DivisionPage } = [];

    const dfs = (page: any, parentSlug: string[], depth: number) => {
      const completeSlug = parentSlug.concat(page.slug);

      let parent = result[page.parentId];
      while (parent) {
        parent.deepestChild = Math.max(parent.deepestChild, depth);
        if (parent.depth < 1 || !parent.parentId) break;
        parent = result[parent.parentId];
      }

      result[page.id] = {
        id: page.id,
        parentId: page.parentId,
        titleEn: page.titleEn,
        titleSv: page.titleSv,
        contentEn: page.contentEn,
        contentSv: page.contentSv,
        completeSlug,
        depth,
        deepestChild: depth
      };

      if (page.children) {
        for (const child of page.children) {
          dfs(child, completeSlug, depth + 1);
        }
      }
    };

    for (const page of pages) {
      dfs(page, [], 0);
    }

    return Object.values(result);
  }

  static checkValidMoveTargets(
    pages: DivisionPage[],
    maxDepth: number,
    editedId?: number
  ) {
    let forbiddenIds = editedId ? [editedId] : [];
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

  static async get(id?: number) {
    const pages = await prisma.divisionPage.findMany({
      where: {
        divisionGroupId: id || null,
        parent: null
      },
      select: {
        id: true,
        parentId: true,
        titleEn: true,
        titleSv: true,
        contentEn: true,
        contentSv: true,
        slug: true,
        children: {
          select: {
            id: true,
            parentId: true,
            titleEn: true,
            titleSv: true,
            contentEn: true,
            contentSv: true,
            slug: true,
            children: {
              select: {
                id: true,
                parentId: true,
                titleEn: true,
                titleSv: true,
                contentEn: true,
                contentSv: true,
                slug: true
              }
            }
          }
        }
      }
    });

    return this.flattenPages(pages);
  }

  static async getBySlug(slug: string[], id?: number) {
    const pages = await this.get(id);
    return this.findBySlug(slug, pages);
  }

  static findBySlug(slug: string[], pages: DivisionPage[]) {
    return pages.find((page) => arrayEquals(page.completeSlug, slug));
  }

  static async post(
    titleEn: string,
    titleSv: string,
    contentEn: string,
    contentSv: string,
    slug: string,
    divisionGroupId?: number,
    parentId?: number
  ) {
    return prisma.divisionPage.create({
      data: {
        titleEn,
        titleSv,
        contentEn,
        contentSv,
        slug,
        divisionGroupId,
        parentId
      }
    });
  }

  static async edit(
    id: number,
    titleEn: string,
    titleSv: string,
    contentEn: string,
    contentSv: string,
    slug: string,
    parentId?: number
  ) {
    return prisma.divisionPage.update({
      where: {
        id
      },
      data: {
        parentId: parentId || null,
        titleEn,
        titleSv,
        contentEn,
        contentSv,
        slug
      }
    });
  }

  static async delete(id: number) {
    return prisma.divisionPage.delete({
      where: {
        id
      }
    });
  }
}
