import prisma from '@/prisma';
import { PrismaClient } from '@/../prisma-old-site/client/old-db';
import GammaService from '@/services/gammaService';
import DivisionGroupService from '@/services/divisionGroupService';
import { PostStatus } from '@prisma/client';
import MediaService from '@/services/mediaService';
import { MediaType } from '@/services/fileService';

const oldPrisma = new PrismaClient();

const mediaUrlRegexPattern =
  '(?<=\\((?:(?:\\s*?https?:\\/\\/chalmers\\.it)|(?:\\s*)))((\\/uploads\\/)|(\\/core\\/wp-content\\/uploads\\/))\\S*?(?=(?:(?:\\s*)|(?:\\s+\\".*?\\"\\s*?))\\))';

const mediaUrlRegex = new RegExp(mediaUrlRegexPattern, 'gi');

export default class MigrationService {
  static async migrate() {
    await this.migrateGroupPages();
    await this.migrateNewsPosts();
    await this.migratePages();
  }

  static async migrateGroupPages() {
    console.log('Migrating group pages');
    const committees = await oldPrisma.committees.findMany();

    const gammaGroups = await GammaService.getAllSuperGroups();

    const gammaGroupsInDb = await DivisionGroupService.getAll();

    const gammaGroupToIdDict: { [key: string]: number } = {};
    for (const group of gammaGroups) {
      const groupInDb = gammaGroupsInDb.find(
        (g) => g.gammaSuperGroupId == group.superGroup.id
      );
      if (!groupInDb) {
        continue;
      }
      gammaGroupToIdDict[group.superGroup.name] = groupInDb.id;
    }

    for (const committee of committees) {
      console.log(`Migrating committee ${committee.name}`);

      if (gammaGroupToIdDict[committee.slug!] == undefined) {
        console.error(`Committee ${committee.name} is missing in the database`);
        continue;
      }

      const committee_translations =
        await oldPrisma.committee_translations.findMany({
          where: { committee_id: committee.id }
        });

      if (committee_translations.length != 2) {
        console.error(
          `Committee ${committee.id} has ${committee_translations.length} translations`
        );
        continue;
      }

      const enTranslation = committee_translations.find(
        (t) => t.locale == 'en'
      );
      const svTranslation = committee_translations.find(
        (t) => t.locale == 'sv'
      );

      if (!enTranslation || !svTranslation) {
        console.error(`Committee ${committee.id} is missing translations`);
        continue;
      }

      await prisma.divisionGroup.update({
        where: { id: gammaGroupToIdDict[committee.slug!] },
        data: {
          prettyName: committee.name!,
          descriptionEn: await this.migrateMediaUrls(
            enTranslation.description!
          ),
          descriptionSv: await this.migrateMediaUrls(
            svTranslation.description!
          ),
          createdAt: committee.created_at!,
          updatedAt: committee.updated_at!
        }
      });
    }
    console.log('Migration of committees done!');
  }

  static async migratePages() {
    console.log('Migrating pages');
    const pages = await oldPrisma.pages.findMany();

    for (const page of pages) {
      console.log(`Migrating page ${page.id}`);
      const page_translations = await oldPrisma.page_translations.findMany({
        where: { page_id: page.id }
      });

      if (page_translations.length != 2) {
        console.error(
          `Page ${page.id} has ${page_translations.length} translations`
        );
        continue;
      }

      const enTranslation = page_translations.find((t) => t.locale == 'en');
      const svTranslation = page_translations.find((t) => t.locale == 'sv');

      if (!enTranslation || !svTranslation) {
        console.error(`Page ${page.id} is missing translations`);
        continue;
      }

      await prisma.divisionPage.create({
        data: {
          titleSv: svTranslation.title!,
          titleEn: enTranslation.title!,
          contentSv: await this.migrateMediaUrls(svTranslation.body!),
          contentEn: await this.migrateMediaUrls(enTranslation.body!),
          slug: page.slug!,
          createdAt: page.created_at!,
          updatedAt: page.updated_at!
        }
      });
    }
    console.log('Migration of pages done!');
  }

  private static async getAllOldGammaUsers() {
    const response = await fetch('https://gamma.chalmers.it/api/admin/users', {
      headers: {
        Authorization: 'pre-shared ' + process.env.OLD_GAMMA_API_KEY
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.statusText);
      throw new Error(`Gamma request failed with status ${response.status}`, {
        cause: errorData
      });
    }

    return (await response.json()) as { id: string; cid: string }[];
  }

  private static async migrateNewsPosts() {
    const gammaSuperGroups = (await GammaService.getAllSuperGroups()).flatMap(
      (value) => value.superGroup
    );

    const gammaSuperGroupsInDb = await DivisionGroupService.getAll();

    const groupNameToGammaIdDict: { [key: string]: number } = {};

    for (const superGroup of gammaSuperGroups) {
      const gammaSuperGroupInDb = gammaSuperGroupsInDb.find(
        (g) => g.gammaSuperGroupId == superGroup.id
      );
      if (!gammaSuperGroupInDb) {
        console.log(
          `Super group ${superGroup.id} is missing from local database`
        );
        continue;
      }
      groupNameToGammaIdDict[superGroup.name] = gammaSuperGroupInDb.id;
    }

    const allGammaUsers = await this.getAllOldGammaUsers();
    const gammaCidToIdDict: { [key: string]: string } = {};
    for (const user of allGammaUsers) {
      gammaCidToIdDict[user.cid] = user.id;
    }

    const newsPosts = await oldPrisma.posts.findMany();
    for (const post of newsPosts) {
      const translations = await oldPrisma.post_translations.findMany({
        where: { post_id: post.id }
      });
      console.log(`Migrating post ${post.id}`);

      if (translations.length != 2) {
        console.error(
          `Post ${post.id} has ${translations.length} translations`
        );
        continue;
      }

      const enTranslation = translations.find((t) => t.locale == 'en');
      const svTranslation = translations.find((t) => t.locale == 'sv');

      if (!enTranslation || !svTranslation) {
        console.error(`Post ${post.id} is missing translations`);
        continue;
      }

      const writtenByGammaId = gammaCidToIdDict[post.user_id!];
      if (!writtenByGammaId) {
        console.error(`Post ${post.id} is missing a author in gamma`);
        continue;
      }

      await prisma.newsPost.create({
        data: {
          titleEn: enTranslation.title!,
          titleSv: svTranslation.title!,
          contentEn: await this.migrateMediaUrls(enTranslation.body!),
          contentSv: await this.migrateMediaUrls(svTranslation.body!),
          createdAt: post.created_at!,
          updatedAt: post.updated_at!,
          divisionGroupId: groupNameToGammaIdDict[post.group_id!],
          writtenByGammaUserId: writtenByGammaId,
          status: PostStatus.PUBLISHED
        }
      });
    }

    console.log('Migration of news done!');
  }

  private static async migrateMediaUrls(postContent: string) {
    const matches = postContent.match(mediaUrlRegex);
    if (!matches) {
      return postContent;
    }

    for (const match of matches) {
      const newUrl = await this.downloadAndImportMedia(
        'https://chalmers.it' + match
      );
      postContent = postContent.replace(match, newUrl);
      postContent = postContent.replace(
        'https://chalmers.it/api/media/',
        '/api/media/'
      );
      postContent = postContent.replace(
        'http://chalmers.it/api/media/',
        '/api/media/'
      );
    }

    return postContent;
  }

  private static async downloadAndImportMedia(url: string) {
    console.log(`Downloading ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to download media from ${url}`);
      return '';
    }

    const blob = await response.blob();

    const file = await MediaService.save(blob, Object.values(MediaType));

    if (!file) {
      throw new Error(`Failed to save media from ${url}`);
    }

    return `/api/media/${file?.sha256}`;
  }
}
