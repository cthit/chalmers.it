import prisma from '@/prisma';
import GammaService from './gammaService';

export default class DivisionGroupService {
  static async getAll() {
    return await prisma.divisionGroup.findMany();
  }

  static async addGroup(gammaSuperGroupId: string, prettyName: string) {
    return await prisma.divisionGroup.create({
      data: {
        gammaSuperGroupId,
        prettyName,
        descriptionEn: 'yeppers peppers',
        descriptionSv: 'yeppers peppers'
      }
    });
  }

  static async removeGroup(gammaSuperGroupId: string) {
    return await prisma.divisionGroup.delete({
      where: {
        gammaSuperGroupId
      }
    });
  }

  static async getBanners() {
    return await prisma.banner.findMany();
  }

  static async getBannerForGroup(groupId: number) {
    return await prisma.divisionGroup.findUnique({
      where: {
        id: groupId
      },
      select: {
        Banner: true
      }
    });
  }

  static async addBanner(groupId: number, bannerSha: string) {
    return await prisma.divisionGroup.update({
      where: {
        id: groupId
      },
      data: {
        Banner: {
          create: {
            mediaSha256: bannerSha
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

  static async getUserActiveGroups(cid: string) {
    return GammaService.getUser(cid).then((user) => {
      return user.groups.filter((group) => group.active);
    });
  }

  static async isUserActive(cid: string): Promise<boolean> {
    return GammaService.getUser(cid).then((user) => {
      return user.groups.some((group) => group.active);
    });
  }
}
