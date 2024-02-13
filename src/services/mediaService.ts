import prisma from '@/prisma';
import { stat, readdir, readFile, writeFile } from 'fs/promises';

const mediaPath = process.env.MEDIA_PATH || './media/';

const convertMimeType = (mimeType: string) => {
  switch (mimeType) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/png':
      return 'png';
    case 'image/gif':
      return 'gif';
    case 'image/webp':
      return 'webp';
    default:
      return null;
  }
};

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

  static async save(file: Blob) {
    const sha256 = await crypto.subtle.digest(
      'SHA-256',
      await file.arrayBuffer()
    );
    const shaString = Array.from(new Uint8Array(sha256)).join('');

    const extension = convertMimeType(file.type);
    if (!extension) return null;

    await writeFile(
      mediaPath + shaString + '.' + extension,
      Buffer.from(await file.arrayBuffer())
    );
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
    return await readFile(mediaPath + sha256 + extension);
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
