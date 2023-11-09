import { prisma } from '@/prisma';

export default class NewsService {
    static getAll() {
        return prisma.newsPost.findMany();
    }

    static post() {
        return prisma.newsPost.create({
            data: {
                titleEn: 'Test',
                titleSv: 'Test',
                contentEn: 'Test',
                contentSv: 'Test',
                writtenByCid: 'Test'
            }
        });
    }

    static edit() {
        return prisma.newsPost.update({
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

    static remove() {
        return prisma.newsPost.delete({
            where: {
                id: 1
            }
        });
    }
}
