import prisma from '@/prisma';
import { PostStatus } from '@prisma/client';
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
        writtenByGammaUserId: cid
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
        writtenByGammaUserId: true,
        status: true,
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
    writtenByGammaUserId: string;
    divisionSuperGroupId?: string;
    scheduledPublish?: Date;
    status?: PostStatus;
  }) {
    const data = {
      data: {
        titleEn: post.titleEn,
        titleSv: post.titleSv,
        contentEn: post.contentEn,
        contentSv: post.contentSv,
        writtenByGammaUserId: post.writtenByGammaUserId,
        scheduledPublish: post.scheduledPublish,
        status: post.status,
        createdAt:
          post.status === PostStatus.SCHEDULED
            ? post.scheduledPublish
            : undefined,
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

    await prisma.newsPost.create(data).then((res) => {
      if (post.status === PostStatus.PUBLISHED)
        NotifyService.notifyNewsPost(res);
    });
  }

  static async edit(edited: {
    titleEn: string;
    titleSv: string;
    contentEn: string;
    contentSv: string;
    id: number;
    scheduledPublish?: Date;
  }) {
    return await prisma.newsPost.update({
      where: {
        id: edited.id
      },
      data: {
        titleEn: edited.titleEn,
        titleSv: edited.titleSv,
        contentEn: edited.contentEn,
        contentSv: edited.contentSv,
        scheduledPublish: edited.scheduledPublish
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

  static async publishScheduled() {
    const scheduled = await prisma.newsPost.findMany({
      where: {
        scheduledPublish: {
          lte: new Date()
        },
        status: PostStatus.SCHEDULED
      }
    });

    scheduled.forEach((post) => {
      prisma.newsPost
        .update({
          where: {
            id: post.id
          },
          data: {
            status: PostStatus.PUBLISHED
          }
        })
        .then((res) => NotifyService.notifyNewsPost(res));
    });
  }
}
