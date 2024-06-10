import prisma from '@/prisma';
import GammaService from './gammaService';

export default class DivisionGroupService {
  static async getAll() {
    return prisma.divisionGroup.findMany();
  }

  static async addGroup(
    gammaSuperGroupId: string,
    prettyName: string,
    slug: string
  ) {
    return prisma.divisionGroup.create({
      data: {
        gammaSuperGroupId,
        prettyName,
        titleEn: 'yeppers peppers',
        titleSv: 'yeppers peppers',
        descriptionEn: 'yeppers peppers',
        descriptionSv: 'yeppers peppers',
        slug
      }
    });
  }

  static async removeGroup(gammaSuperGroupId: string) {
    return prisma.divisionGroup.delete({
      where: {
        gammaSuperGroupId
      }
    });
  }

  static async getBanners() {
    return prisma.banner.findMany({
      select: {
        id: true,
        divisionGroupId: true,
        mediaSha256: true,
        divisionGroup: {
          select: {
            prettyName: true
          }
        }
      }
    });
  }

  static async getRandomBanner() {
    const groups = (await GammaService.getAllSuperGroups()).filter(
      (g) => g.hasBanner
    );
    if (groups.length === 0) return null;
    const randomGroup = groups[Math.floor(Math.random() * groups.length)];
    return {
      url: GammaService.getSuperGroupBannerURL(randomGroup.superGroup.id),
      name: randomGroup.superGroup.prettyName
    };
  }

  static async getBannerForGroup(groupId: number) {
    return prisma.divisionGroup.findUnique({
      where: {
        id: groupId
      },
      select: {
        Banner: true
      }
    });
  }

  static async getInfoBySlug(slug: string) {
    return prisma.divisionGroup.findUnique({
      where: {
        slug
      },
      select: {
        id: true,
        gammaSuperGroupId: true,
        prettyName: true,
        titleEn: true,
        titleSv: true,
        descriptionEn: true,
        descriptionSv: true
      }
    });
  }

  static async getInfo(id: number) {
    return prisma.divisionGroup.findUnique({
      where: {
        id
      },
      select: {
        gammaSuperGroupId: true,
        prettyName: true,
        titleEn: true,
        titleSv: true,
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
    return prisma.divisionGroup.update({
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

  static async getUserActiveGroupsWithPosts(cid: string) {
    return (await GammaService.getUser(cid)).groups.filter((g) =>
      GammaService.isGroupActive(g.group)
    );
  }

  static async getUserActiveGroups(cid: string) {
    return (await this.getUserActiveGroupsWithPosts(cid)).map((g) => g.group);
  }

  static async isUserActive(cid: string): Promise<boolean> {
    return GammaService.getUser(cid).then((user) => {
      return user.groups.some((g) => GammaService.isGroupActive(g.group));
    });
  }

  static async editInfo(edited: {
    titleEn: string;
    titleSv: string;
    contentEn: string;
    contentSv: string;
    id: number;
    slug: string;
  }) {
    return prisma.divisionGroup.update({
      where: {
        id: edited.id
      },
      data: {
        titleEn: edited.titleEn,
        titleSv: edited.titleSv,
        descriptionEn: edited.contentEn,
        descriptionSv: edited.contentSv,
        slug: edited.slug
      }
    });
  }

  static async getGammaSuperGroupIdFromInternalId(id: number) {
    return (
      await prisma.divisionGroup.findUnique({
        where: { id },
        select: { gammaSuperGroupId: true }
      })
    )?.gammaSuperGroupId;
  }
}
