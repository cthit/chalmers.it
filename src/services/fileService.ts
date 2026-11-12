import {
  DEFAULT_MAX_MEDIA_SIZE_BYTES,
  DEFAULT_MAX_UPLOAD_SIZE_BYTES,
  parsePositiveIntEnv
} from '@/utils/env';

const maxMediaSizeBytes = parsePositiveIntEnv(
  process.env.MAX_MEDIA_SIZE,
  DEFAULT_MAX_MEDIA_SIZE_BYTES
);

export enum MediaType {
  Image = 'image',
  Document = 'document',
  Container = 'container'
}

export interface MediaMeta {
  type: MediaType;
  extension: string;
}

const mimeTypes: { [key: string]: MediaMeta } = {
  'image/jpeg': { type: MediaType.Image, extension: 'jpg' },
  'image/png': { type: MediaType.Image, extension: 'png' },
  'image/gif': { type: MediaType.Image, extension: 'gif' },
  'image/webp': { type: MediaType.Image, extension: 'webp' },
  'application/pdf': { type: MediaType.Document, extension: 'pdf' },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    type: MediaType.Document,
    extension: 'docx'
  },
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    type: MediaType.Document,
    extension: 'xlsx'
  },
  'application/vnd.oasis.opendocument.text': {
    type: MediaType.Document,
    extension: 'odt'
  },
  'application/vnd.oasis.opendocument.spreadsheet': {
    type: MediaType.Document,
    extension: 'ods'
  },
  'application/zip': { type: MediaType.Container, extension: 'zip' }
};

/**
 * Helper class for media operations common to client and server
 */
export default class FileService {
  static readonly maxMediaSizeBytes = maxMediaSizeBytes;

  static get maxUploadSizeBytes() {
    return parsePositiveIntEnv(
      process.env.MAX_UPLOAD_SIZE,
      DEFAULT_MAX_UPLOAD_SIZE_BYTES
    );
  }

  static formatBytes(bytes: number) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';

    const units = ['B', 'KiB', 'MiB', 'GiB'];
    let value = bytes;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
      value /= 1024;
      unit++;
    }

    return `${parseFloat(value.toFixed(1))} ${units[unit]}`;
  }

  /**
   * Calculate SHA-256 hash of file on server
   */
  static async fileSha256(file: Blob) {
    const sha256 = await crypto.subtle.digest(
      'SHA-256',
      await file.arrayBuffer()
    );
    return Buffer.from(sha256).toString('base64url');
  }

  /**
   * Calculate SHA-256 hash of file on client
   */
  static async fileSha256Browser(file: File) {
    const sha256 = await crypto.subtle.digest(
      'SHA-256',
      await file.arrayBuffer()
    );
    return Buffer.from(sha256)
      .toString('base64')
      .replace(/\//g, '_')
      .replace(/\+/g, '-')
      .replace(/=+$/, '');
  }

  static checkValidFile(file: Blob | File, types: MediaType[]) {
    const meta = this.convertMimeType(file.type);
    return (
      file.size <= this.maxMediaSizeBytes && meta && types.includes(meta.type)
    );
  }

  static convertMimeType(mimeType: string): MediaMeta | null {
    return mimeTypes[mimeType] ?? null;
  }

  static replaceLocalFiles(
    text: string,
    files: {
      [key: string]: File;
    }
  ) {
    let newText = text;
    for (const [sha256, file] of Object.entries(files)) {
      newText = newText.replace(
        '(/api/media/' + sha256 + ')',
        '(' + URL.createObjectURL(file) + ')'
      );
    }

    return newText;
  }

  static getValidMimes(types: MediaType[]) {
    return Object.keys(mimeTypes).filter((key) =>
      types.includes(mimeTypes[key].type)
    );
  }

  static isMimeEmbeddable(mime: string) {
    const meta = this.convertMimeType(mime);
    return meta?.type === MediaType.Image;
  }
}
