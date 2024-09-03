import prisma from '@/prisma';

export default class NavService {
  static async get() {
    return await prisma.navbarCategory.findMany({
      include: {
        NavbarItem: true
      },
      orderBy: {
        priority: 'asc'
      }
    });
  }

  static async addCategory(nameEn: string, nameSv: string, priority?: number) {
    return await prisma.navbarCategory.create({
      data: {
        nameEn,
        nameSv,
        priority
      }
    });
  }

  static async addItem(
    categoryId: number,
    nameEn: string,
    nameSv: string,
    url: string,
    priority?: number
  ) {
    return await prisma.navbarItem.create({
      data: {
        nameEn,
        nameSv,
        url,
        priority,
        categoryId
      }
    });
  }

  static async removeCategory(id: number) {
    return await prisma.navbarCategory.delete({
      where: {
        id
      }
    });
  }

  static async removeItem(id: number) {
    return await prisma.navbarItem.delete({
      where: {
        id
      }
    });
  }

  static async updateCategory(
    id: number,
    nameEn: string,
    nameSv: string,
    priority?: number
  ) {
    return await prisma.navbarCategory.update({
      where: {
        id
      },
      data: {
        nameEn,
        nameSv,
        priority
      }
    });
  }

  static async updateItem(
    id: number,
    nameEn: string,
    nameSv: string,
    url: string,
    priority?: number
  ) {
    return await prisma.navbarItem.update({
      where: {
        id
      },
      data: {
        nameEn,
        nameSv,
        url,
        priority
      }
    });
  }
}
