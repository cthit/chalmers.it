const apiKey = process.env.GOTIFY_TOKEN;
const gotifyUrl = process.env.GOTIFY_ROOT_URL?.replace(/\/$/, '');

export interface GotifyAttachment {
  name: string;
  data: string;
  content_type: string;
}

export default class GotifyService {
  static async sendMessage(
    to: string,
    from: string,
    subject: string,
    body: string,
    attachments: GotifyAttachment[] = []
  ) {
    if (!gotifyUrl || !apiKey) throw new Error('Gotify is not configured');

    const response = await fetch(`${gotifyUrl}/mail`, {
      method: 'POST',
      headers: {
        Authorization: `pre-shared: ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to, from, subject, body, attachments })
    });

    if (!response.ok) {
      const cause = await response.text();
      throw new Error(`Gotify request failed with status ${response.status}`, {
        cause
      });
    }
  }
}
