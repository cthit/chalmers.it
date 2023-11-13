import { prisma } from '@/prisma';

export default class SponsorService {
  static async getAll() {
    return await prisma.divisionGroup.findMany();
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
    descriptionSv: string;
    descriptionEn: string;
    logoSha?: string;
  }) {
    return await prisma.sponsor.create({
      data: {
        nameSv: sponsor.nameSv,
        nameEn: sponsor.nameEn,
        descriptionSv: sponsor.descriptionSv,
        descriptionEn: sponsor.descriptionEn,
        mediaSha256: sponsor.logoSha
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
