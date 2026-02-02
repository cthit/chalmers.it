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
        scheduledPublish: true,
        writtenFor: {
          select: {
            gammaSuperGroupId: true,
            prettyName: true
          }
        },
        connectedEvents: {
          select: {
            id: true,
            titleEn: true,
            titleSv: true,
            startTime: true,
            endTime: true,
            fullDay: true,
            location: true
          }
        }
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

  static async getPage(
    page: number,
    pageSize: number,
    userId?: string,
    groupIds?: string[]
  ) {
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
        scheduledPublish: true,
        writtenByGammaUserId: true,
        status: true,
        writtenFor: {
          select: {
            gammaSuperGroupId: true,
            prettyName: true
          }
        },
        connectedEvents: {
          select: {
            id: true,
            titleEn: true,
            titleSv: true,
            descriptionEn: true,
            descriptionSv: true,
            fullDay: true,
            startTime: true,
            endTime: true,
            location: true,
            createdAt: true,
            updatedAt: true
          }
        }
      },
      where: {
        OR: [
          {
            status: PostStatus.PUBLISHED
          },
          {
            writtenByGammaUserId: userId
          },
          {
            writtenFor: {
              gammaSuperGroupId: {
                in: groupIds ?? []
              }
            }
          }
        ]
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

    const res = await prisma.newsPost.create(data);
    if (post.status === PostStatus.PUBLISHED) NotifyService.notifyNewsPost(res);
    return res;
  }

  static async edit(edited: {
    titleEn: string;
    titleSv: string;
    contentEn: string;
    contentSv: string;
    id: number;
    scheduledPublish?: Date | null;
  }) {
    const post = await prisma.newsPost.findUnique({
      where: {
        id: edited.id
      }
    });

    const updateScheduledPublish = post?.scheduledPublish !== null;
    const publish =
      edited.scheduledPublish === null && post?.status === PostStatus.SCHEDULED;

    const updatedPost = await prisma.newsPost.update({
      where: {
        id: edited.id
      },
      data: {
        titleEn: edited.titleEn,
        titleSv: edited.titleSv,
        contentEn: edited.contentEn,
        contentSv: edited.contentSv,
        status: publish ? PostStatus.PUBLISHED : undefined,
        createdAt: publish ? new Date() : undefined,
        scheduledPublish: updateScheduledPublish
          ? edited.scheduledPublish
          : undefined
      }
    });

    if (publish) NotifyService.notifyNewsPost(updatedPost);

    return updatedPost;
  }

  static async remove(id: number) {
    return await prisma.newsPost.delete({
      where: {
        id
      }
    });
  }

  static async search(
    locale: string,
    query?: string,
    before?: Date,
    after?: Date,
    userId?: string,
    groupIds?: string[],
    writtenByGammaUserId?: string,
    writtenFor?: string
  ) {
    return await prisma.newsPost.findMany({
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
        scheduledPublish: true,
        writtenByGammaUserId: true,
        status: true,
        writtenFor: {
          select: {
            gammaSuperGroupId: true,
            prettyName: true
          }
        }
      },
      where: {
        AND: [
          {
            OR:
              locale === 'en'
                ? [
                    {
                      titleEn: {
                        contains: query,
                        mode: 'insensitive'
                      }
                    },
                    {
                      contentEn: {
                        contains: query,
                        mode: 'insensitive'
                      }
                    }
                  ]
                : [
                    {
                      titleSv: {
                        contains: query,
                        mode: 'insensitive'
                      }
                    },
                    {
                      contentSv: {
                        contains: query,
                        mode: 'insensitive'
                      }
                    }
                  ]
          },
          {
            OR: [
              {
                status: PostStatus.PUBLISHED
              },
              {
                writtenByGammaUserId: userId
              },
              {
                writtenFor: {
                  gammaSuperGroupId: {
                    in: groupIds
                  }
                }
              }
            ]
          },
          {
            writtenByGammaUserId
          },
          {
            writtenFor: {
              gammaSuperGroupId: writtenFor
            }
          }
        ],
        createdAt: {
          gte: after,
          lte: before
        }
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
