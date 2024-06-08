import prisma from '@/prisma';
import { stat, readdir, readFile, writeFile } from 'fs/promises';
import FileService, { MediaType } from './fileService';

const mediaPath = process.env.MEDIA_PATH || './media';

/**
 * Helper class for media operations on server
 */
export default class MediaService {
  static async get(sha256: string) {
    return await prisma.media.findUnique({
      where: {
        sha256
      }
    });
  }

  static async delete(sha256: string) {
    return await prisma.media.delete({
      where: {
        sha256
      }
    });
  }

  static async save(file: Blob, types: MediaType[]) {
    if (!FileService.checkValidFile(file, types)) return null;

    const meta = FileService.convertMimeType(file.type);
    if (!meta) return null;

    const shaString = await FileService.fileSha256(file);

    // Write file if it doesn't already exist in file system
    await stat(`${mediaPath}/${shaString}.${meta.extension}`).catch(
      async () =>
        await writeFile(
          `${mediaPath}/${shaString}.${meta.extension}`,
          Buffer.from(await file.arrayBuffer())
        )
    );

    // Return file info if it already exists in database
    const existsDb = await prisma.media.findUnique({
      where: {
        sha256: shaString
      }
    });
    if (existsDb) return existsDb;

    return await prisma.media.create({
      data: {
        sha256: shaString,
        extension: file.type
      }
    });
  }

  static async load(sha256: string) {
    const extension = await prisma.media.findUnique({
      where: {
        sha256
      },
      select: {
        extension: true
      }
    });

    const meta = FileService.convertMimeType(extension!.extension);
    const filename = sha256 + '.' + meta?.extension;

    return {
      data: await readFile(`${mediaPath}/${filename}`),
      filename,
      extension: extension!.extension
    };
  }

  static async getStats() {
    const dir = await readdir(mediaPath, { withFileTypes: true });

    let size = 0;
    for (const dirent of dir) {
      if (dirent.isFile()) {
        size += (await stat(mediaPath + dirent.name)).size;
      }
    }

    const used = await prisma.media.count();

    return { count: dir.length, size, used };
  }
}
