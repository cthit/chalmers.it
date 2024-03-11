import { Prisma, NotifierType, Language } from '@prisma/client';
import prisma from '@/prisma';
import GammaService from './gammaService';

interface Notifier {
  notifyNewsPost(_post: Prisma.NewsPostGetPayload<{}>): void;
  readonly language: Language;
  readonly webhook: string;
  readonly type: NotifierType;
}

export default class NotifyService {
  static async notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    for (const notifier of await NotifyService.getNotifiers()) {
      switch (notifier.type) {
        case NotifierType.DISCORD:
          await new DiscordWebhookNotifier(
            notifier.url,
            notifier.language
          ).notifyNewsPost(post);
          break;
        case NotifierType.SLACK:
          await new SlackWebhookNotifier(
            notifier.url,
            notifier.language
          ).notifyNewsPost(post);
          break;
      }
    }
  }

  static async getNotifiers() {
    return await prisma.eventNotifiers.findMany();
  }

  static async addNotifier(
    type: NotifierType,
    language: Language,
    webhook: string
  ) {
    await prisma.eventNotifiers.create({
      data: {
        type: type,
        url: webhook,
        language: language
      }
    });
  }
}

class DiscordWebhookNotifier implements Notifier {
  public readonly webhook: string;
  public readonly language: Language;
  public readonly type: NotifierType = NotifierType.DISCORD;

  public constructor(webhook: string, language: Language) {
    this.webhook = webhook;
    this.language = language;
  }

  async notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    const nick =
      (await GammaService.getNick(post.writtenByGammaUserId)) ||
      (Language.EN ? 'Unknown user' : 'Okänd användare');
    const title = this.language === Language.EN ? post.titleEn : post.titleSv;
    const content =
      this.language === Language.EN ? post.contentEn : post.contentSv;
    const msg =
      this.language === Language.EN
        ? `News published by **${nick}**`
        : `Nyhet publicerad av **${nick}**`;

    fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: msg,
        embeds: [
          {
            title: title,
            url: `http://${process.env.BASE_URL || 'localhost:3000'}/post/${
              post.id
            }`,
            description: content,
            color: 0x00a8d3,
            image: {
              url: 'https://chalmers.it/assets/logo-dark-txt-61b29abd5e9c8df2f6c500817b0dad65e86bd177cc29d88df9ee1507f9e8ebff.png'
            }
          }
        ]
      })
    });
  }
}

class SlackWebhookNotifier implements Notifier {
  public readonly webhook: string;
  public readonly language: Language;
  public readonly type: NotifierType = NotifierType.SLACK;

  public constructor(webhook: string, language: Language) {
    this.webhook = webhook;
    this.language = language;
  }

  async notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    const nick =
      (await GammaService.getNick(post.writtenByGammaUserId)) ||
      (Language.EN ? 'Unknown user' : 'Okänd användare');
    const title = this.language === Language.EN ? post.titleEn : post.titleSv;
    const content =
      this.language === Language.EN ? post.contentEn : post.contentSv;
    const msg =
      this.language === Language.EN
        ? `News published by *${nick}*`
        : `Nyhet publicerad av *${nick}*`;

    fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: msg
            }
          }
        ],
        attachments: [
          {
            color: '#00a8d3',
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*<http://${
                    process.env.BASE_URL || 'localhost:3000'
                  }/post/${post.id}|${title}>*`
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${content}`
                }
              },
              {
                type: 'image',
                image_url:
                  'https://chalmers.it/assets/logo-dark-txt-61b29abd5e9c8df2f6c500817b0dad65e86bd177cc29d88df9ee1507f9e8ebff.png',
                alt_text: 'inspiration'
              }
            ]
          }
        ]
      })
    });
  }
}
