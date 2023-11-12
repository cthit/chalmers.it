import { prisma } from '@/prisma';

export default class EventService {
  static async getAll() {
    return await prisma.event.findMany();
  }
}
