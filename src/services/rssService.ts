import i18nService from './i18nService';

interface NewsItem {
  id: number;
  titleEn: string;
  titleSv: string;
  contentEn: string;
  contentSv: string;
  createdAt: Date | string;
  writtenFor: {
    prettyName: string;
  } | null;
}

export default class RssFeedService {
  /**
   * Converts a date to RFC 822 format for RSS feeds
   * Example: "Mon, 14 Apr 2025 10:00:00 GMT"
   */
  private static dateToRFC822(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];

    const dayName = days[d.getUTCDay()];
    const dayNum = String(d.getUTCDate()).padStart(2, '0');
    const monthName = months[d.getUTCMonth()];
    const year = d.getUTCFullYear();
    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');

    return `${dayName}, ${dayNum} ${monthName} ${year} ${hours}:${minutes}:${seconds} GMT`;
  }

  /**
   * Escapes XML special characters
   */
  private static escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Generates an RSS 2.0 feed for the given news items
   * @param newsItems Array of news posts
   * @param locale 'sv' or 'en'
   * @param baseUrl Base URL for the site (e.g., https://chalmers.it)
   * @returns RSS 2.0 XML string
   */
  static generateFeed(
    newsItems: NewsItem[],
    locale: string = 'sv',
  ): string {
    const i18n = i18nService.getLocale(locale);
    const isSv = locale === 'sv';
    const langTag = isSv ? 'sv-SE' : 'en-US';
    const baseUrl = process.env.BASE_URL || 'https://chalmers.it';
    const baseUrlWithoutSlash = baseUrl.endsWith('/')
      ? baseUrl.slice(0, -1)
      : baseUrl;

    // Build the items XML
    const itemsXml = newsItems
      .map((item) => {
        const title = isSv ? item.titleSv : item.titleEn;
        const content = isSv ? item.contentSv : item.contentEn;
        const pubDate = new Date(item.createdAt).toUTCString();
        const link = `${baseUrlWithoutSlash}/post/${item.id}`;
        const category = item.writtenFor?.prettyName || '';

        return `    <item>
      <title>${this.escapeXml(title)}</title>
      <description>${this.escapeXml(content)}</description>
      <link>${link}</link>
      <pubDate>${pubDate}</pubDate>
      <guid>${item.id}</guid>
      ${category ? `<category>${this.escapeXml(category)}</category>` : ''}
    </item>`;
      })
      .join('\n');

    // Build the complete RSS feed
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${this.escapeXml(i18n.news.title)}</title>
    <link>${baseUrlWithoutSlash}</link>
    <description>${this.escapeXml(i18n.news.title)}</description>
    <language>${langTag}</language>
${itemsXml}
  </channel>
</rss>`;

    return rss;
  }
}
