// Default max size is 100 MiB
const maxMediaSize = parseInt(process.env.MAX_MEDIA_SIZE || '104857600');

/**
 * Helper class for media operations common to client and server
 */
export default class FileService {
  static readonly maxMediaSize = maxMediaSize;

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

  static checkValidFile(file: Blob | File) {
    return (
      file.size <= this.maxMediaSize && this.convertMimeType(file.type) !== null
    );
  }

  static convertMimeType(mimeType: string) {
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
  }
}
