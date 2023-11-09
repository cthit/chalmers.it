import { prisma } from '@/prisma';

export default class NewsService {

    static getAll() {
        return prisma.newsPost.findMany();
    }

}