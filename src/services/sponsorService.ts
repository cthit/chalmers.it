import prisma from '@/prisma';
import { SponsorType } from '@prisma/client';

export default class SponsorService {
  static async getAll() {
    return await prisma.sponsor.findMany({
      orderBy: {
        type: 'desc'
      }
    });
  }

  static async getLogo(id: number) {
    return await prisma.sponsor.findUnique({
      where: {
        id
      },
      select: {
        mediaSha256: true
      }
    });
  }

  static async setLogo(id: number, logoSha: string) {
    return await prisma.sponsor.update({
      where: {
        id
      },
      data: {
        mediaSha256: logoSha
      }
    });
  }

  static async create(sponsor: {
    nameSv: string;
    nameEn: string;
    url: string;
    logoSha?: string;
    type: SponsorType;
  }) {
    return await prisma.sponsor.create({
      data: {
        nameSv: sponsor.nameSv,
        nameEn: sponsor.nameEn,
        url: sponsor.url,
        mediaSha256: sponsor.logoSha,
        type: sponsor.type
      }
    });
  }

  static async remove(id: number) {
    return await prisma.sponsor.delete({
      where: {
        id
      }
    });
  }
}
