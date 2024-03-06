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
      },
      select: {
        id: true,
        titleEn: true,
        titleSv: true,
        contentEn: true,
        contentSv: true,
        createdAt: true,
        updatedAt: true,
        writtenByCid: true,
        writtenFor: {
          select: {
            gammaSuperGroupId: true,
            prettyName: true
          }
        }
      }
    });
  }

  static async post(post: {
    titleEn: string;
    titleSv: string;
    contentEn: string;
    contentSv: string;
    writtenByCid: string;
    divisionSuperGroupId?: string;
  }) {
    const data = {
      data: {
        titleEn: post.titleEn,
        titleSv: post.titleSv,
        contentEn: post.contentEn,
        contentSv: post.contentSv,
        writtenByCid: post.writtenByCid,
        writtenFor: {}
      }
    };

    if (post.divisionSuperGroupId) {
      data.data.writtenFor = {
        connect: {
          gammaSuperGroupId: post.divisionSuperGroupId
        }
      };
    }

    prisma.newsPost
      .create(data)
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
