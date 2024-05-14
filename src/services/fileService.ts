export default class FileService {
  static async fileSha256(file: Blob | File) {
    const sha256 = await crypto.subtle.digest(
      'SHA-256',
      await file.arrayBuffer()
    );
    return Buffer.from(sha256).toString('base64');
  }
}
