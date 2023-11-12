import { prisma } from '@/prisma';
import NotifyService from './notifyService';

export default class NewsService {
  static async getAll() {
    return await prisma.newsPost.findMany();
  }

  static async getById(id: number) {
    return await prisma.newsPost.findUnique({
      where: {
        id: id
      }
    });
  }

  static async post() {
    const res = prisma.newsPost
      .create({
        data: {
          titleEn: 'Test (but english)',
          titleSv: 'Testnyhet',
          contentEn: 'Test but in english',
          contentSv:
            'Detta är en testnyhet för att testa nyheter.\nDet finns även stöd för emojis! 😀',
          writtenByCid: 'Goose'
        }
      })
      .then((res) => NotifyService.notifyNewsPost(res));
  }

  static async edit() {
    return await prisma.newsPost.update({
      where: {
        id: 1
      },
      data: {
        titleEn: 'Test',
        titleSv: 'Test',
        contentEn: 'Test',
        contentSv: 'Test'
      }
    });
  }

  static async remove() {
    return await prisma.newsPost.delete({
      where: {
        id: 1
      }
    });
  }
}
