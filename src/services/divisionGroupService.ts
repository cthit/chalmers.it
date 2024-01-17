import prisma from '@/prisma';
import GammaService from './gammaService';

export default class DivisionGroupService {
  static async getAll() {
    return await prisma.divisionGroup.findMany();
  }

  static async getBanners(groupId: number) {
    return await prisma.divisionGroup.findUnique({
      where: {
        id: groupId
      },
      select: {
        Banner: true
      }
    });
  }

  static async addBanner(groupId: number, bannerId: number) {
    return await prisma.divisionGroup.update({
      where: {
        id: groupId
      },
      data: {
        Banner: {
          connect: {
            id: bannerId
          }
        }
      }
    });
  }

  static async getInfo(id: number) {
    return await prisma.divisionGroup.findUnique({
      where: {
        id
      },
      select: {
        gammaSuperGroupId: true,
        prettyName: true,
        descriptionEn: true,
        descriptionSv: true
      }
    });
  }

  static async setInfo(
    id: number,
    info: {
      gammaSuperGroupId: string;
      prettyName: string;
      descriptionEn: string;
      descriptionSv: string;
    }
  ) {
    return await prisma.divisionGroup.update({
      where: {
        id
      },
      data: {
        gammaSuperGroupId: info.gammaSuperGroupId,
        prettyName: info.prettyName,
        descriptionEn: info.descriptionEn,
        descriptionSv: info.descriptionSv
      }
    });
  }

  static async isUserActive(_cid: string): Promise<boolean> {
    return GammaService.getUser(_cid).then((user) => {
      return user.groups.some((group) => group.active);
    });
  }
}
