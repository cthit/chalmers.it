import FileService from '@/services/fileService';

/** RegExp which matches images and other Markdown embeds. */
export const imgMatcher = /!\[.*?\]\((.*?)\)/;

/**
 * Create a Markdown link to a media file.
 * @param sha256 The hash of the file.
 * @param file The file itself.
 * @returns The link which may be an embed depending on the MIME type.
 */
export function createMarkdownLinkToMedia(sha256: string, file: File): string {
  const embed = FileService.isMimeEmbeddable(file.type);
  return (embed ? '!' : '') + '[Text](/api/media/' + sha256 + ')';
}
