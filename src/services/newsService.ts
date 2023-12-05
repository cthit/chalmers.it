import prisma from '@/prisma';
import NotifyService from './notifyService';

export default class NewsService {
  static async getAll() {
    return await prisma.newsPost.findMany();
  }

  static async get(id: number) {
    return await prisma.newsPost.findUnique({
      where: {
        id
      }
    });
  }

  static async getByCommittee(id: number) {
    return await prisma.divisionGroup.findMany({
      where: {
        id
      },
      select: {
        NewsPost: true
      }
    });
  }

  static async getByCid(cid: string) {
    return await prisma.newsPost.findMany({
      where: {
        writtenByCid: cid
      }
    });
  }

  static async getPage(page: number, pageSize: number) {
    return await prisma.newsPost.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async post(post: {
    titleEn: string;
    titleSv: string;
    contentEn: string;
    contentSv: string;
    writtenByCid: string;
  }) {
    const res = prisma.newsPost
      .create({
        data: {
          titleEn: post.titleEn,
          titleSv: post.titleSv,
          contentEn: post.contentEn,
          contentSv: post.contentSv,
          writtenByCid: post.writtenByCid
        }
      })
      .then((res) => NotifyService.notifyNewsPost(res));
  }

  static async edit(edited: {
    titleEn: string;
    titleSv: string;
    contentEn: string;
    contentSv: string;
    id: number;
  }) {
    return await prisma.newsPost.update({
      where: {
        id: edited.id
      },
      data: {
        titleEn: edited.titleEn,
        titleSv: edited.titleSv,
        contentEn: edited.contentEn,
        contentSv: edited.contentSv
      }
    });
  }

  static async remove(id: number) {
    return await prisma.newsPost.delete({
      where: {
        id
      }
    });
  }

  static async search(query: string) {
    return await prisma.newsPost.findMany({
      where: {
        OR: [
          {
            titleEn: {
              contains: query
            }
          },
          {
            titleSv: {
              contains: query
            }
          }
        ]
      }
    });
  }
}
