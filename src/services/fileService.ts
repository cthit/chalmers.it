export default class FileService {
  static async fileSha256(file: Blob) {
    const sha256 = await crypto.subtle.digest(
      'SHA-256',
      await file.arrayBuffer()
    );
    return Buffer.from(sha256).toString('base64url');
  }

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
}
