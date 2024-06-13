import prisma from '@/prisma';

export default class EventService {
  static stripTime(d: Date) {
    return new Date(d).setHours(0, 0, 0, 0) - d.getTimezoneOffset() * 60 * 1000;
  }

  static async getAll() {
    return await prisma.event.findMany();
  }

  static async get(id: number) {
    return await prisma.event.findUnique({
      where: {
        id
      }
    });
  }

  static async create(event: {
    titleEn: string;
    titleSv: string;
    descriptionEn: string;
    descriptionSv: string;
    fullDay: boolean;
    startTime: Date;
    endTime: Date;
    newsPostId?: number;
    location?: string;
  }) {
    return await prisma.event.create({
      data: {
        titleEn: event.titleEn,
        titleSv: event.titleSv,
        descriptionEn: event.descriptionEn,
        descriptionSv: event.descriptionSv,
        fullDay: event.fullDay,
        startTime: event.startTime,
        endTime: event.endTime,
        newsPostId: event.newsPostId,
        location: event.location
      }
    });
  }

  static async update(
    id: number,
    event: {
      titleEn: string;
      titleSv: string;
      descriptionEn: string;
      descriptionSv: string;
      fullDay: boolean;
      startTime: Date;
      endTime: Date;
      newsPostId?: number;
    }
  ) {
    return await prisma.event.update({
      where: {
        id
      },
      data: {
        titleEn: event.titleEn,
        titleSv: event.titleSv,
        descriptionEn: event.descriptionEn,
        descriptionSv: event.descriptionSv,
        fullDay: event.fullDay,
        startTime: event.startTime,
        endTime: event.endTime,
        newsPostId: event.newsPostId
      }
    });
  }

  static async delete(id: number) {
    return await prisma.event.delete({
      where: {
        id
      }
    });
  }
}
