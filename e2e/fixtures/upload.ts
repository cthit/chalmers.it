// A complete 1x1 PNG. The upload tests compare these bytes with the media API response.
export const committeeImage = {
  name: 'committee.png',
  mimeType: 'image/png',
  buffer: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV1sAAAAASUVORK5CYII=',
    'base64'
  )
};
