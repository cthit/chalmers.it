import prisma from '@/prisma';
import { stat, readdir, readFile, writeFile } from 'fs/promises';

// TODO: Use a config down the line
const MEDIA_PATH = './media/';

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

  static async upload(file: Blob) {
    const sha256 = await crypto.subtle.digest(
      'SHA-256',
      await file.arrayBuffer()
    );
    const shaString = Array.from(new Uint8Array(sha256)).join('');
    await writeFile(
      MEDIA_PATH + shaString + file.type,
      Buffer.from(await file.arrayBuffer())
    );
    return await prisma.media.create({
      data: {
        sha256: shaString,
        extension: file.type
      }
    });
  }

  static async download(sha256: string) {
    const extension = await prisma.media.findUnique({
      where: {
        sha256
      },
      select: {
        extension: true
      }
    });
    return await readFile(MEDIA_PATH + sha256 + extension);
  }

  static async getStats() {
    const dir = await readdir(MEDIA_PATH, { withFileTypes: true });

    let size = 0;
    for (const dirent of dir) {
      if (dirent.isFile()) {
        size += (await stat(MEDIA_PATH + dirent.name)).size;
      }
    }

    const used = await prisma.media.count();

    return { count: dir.length, size, used };
  }
}
