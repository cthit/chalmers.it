import prisma from '@/prisma';

export default class DivisionPageService {
  static async getAll() {
    return await prisma.divisionGroup.findMany();
  }

  static async get(id?: number) {
    return await prisma.divisionPage.findMany({
      where: {
        divisionGroupId: id,
        parent: null
      },
      select: {
        titleEn: true,
        titleSv: true,
        slug: true,
        children: {
          select: {
            titleEn: true,
            titleSv: true,
            slug: true,
            children: {
              select: {
                titleEn: true,
                titleSv: true,
                slug: true
              }
            }
          }
        }
      }
    });
  }

  static async post(
    titleEn: string,
    titleSv: string,
    contentEn: string,
    contentSv: string,
    slug: string,
    divisionGroupId: number,
    parentId?: number
  ) {
    return await prisma.divisionPage.create({
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
    slug: string
  ) {
    return await prisma.divisionPage.update({
      where: {
        id
      },
      data: {
        titleEn,
        titleSv,
        contentEn,
        contentSv,
        slug
      }
    });
  }

  static async delete(id: number) {
    return await prisma.divisionPage.delete({
      where: {
        id
      }
    });
  }
}
