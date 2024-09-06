import { Prisma, NotifierType, Language } from '@prisma/client';
import prisma from '@/prisma';
import GammaService from './gammaService';
import { markdownToBlocks } from '@tryfabric/mack';
import DivisionGroupService from './divisionGroupService';

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

  static async removeNotifier(id: number) {
    await prisma.eventNotifiers.delete({
      where: {
        id: id
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
    const group =
      post.divisionGroupId !== null
        ? await DivisionGroupService.getInfo(post.divisionGroupId)
        : null;
    const title = this.language === Language.EN ? post.titleEn : post.titleSv;
    const content =
      this.language === Language.EN ? post.contentEn : post.contentSv;
    const msg =
      this.language === Language.EN
        ? `News published${group ? ` for **${group.prettyName}**` : ''} by **${nick}**`
        : `Nyhet publicerad${group ? ` för **${group.prettyName}**` : ''} av **${nick}**`;

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
            url: `${process.env.BASE_URL ?? 'http://localhost:3000'}/post/${
              post.id
            }`,
            description: content,
            color: 0x00a8d3
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

  private mergeSections(blocks: any[]) {
    const merged: any[] = [];
    for (const block of blocks) {
      if (block.type === 'section') {
        if (merged.length > 0 && merged[merged.length - 1].type === 'section') {
          merged[merged.length - 1].text.text += '\n\n' + block.text.text;
        } else {
          merged.push(block);
        }
      } else {
        merged.push(block);
      }
    }
    return merged;
  }

  async notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    const nick =
      (await GammaService.getNick(post.writtenByGammaUserId)) ||
      (this.language === Language.EN ? 'Unknown user' : 'Okänd användare');
    const group =
      post.divisionGroupId !== null
        ? await DivisionGroupService.getInfo(post.divisionGroupId)
        : null;
    const title = this.language === Language.EN ? post.titleEn : post.titleSv;
    const content = this.mergeSections(
      await markdownToBlocks(
        this.language === Language.EN ? post.contentEn : post.contentSv
      )
    );
    const msg =
      this.language === Language.EN
        ? `Published${group ? ` for *${group.prettyName}*` : ''} by *${nick}*`
        : `Publicerad${group ? ` för *${group.prettyName}*` : ''} av *${nick}*`;

    fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        attachments: [
          {
            color: '#00a8d3',
            blocks: [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: title
                }
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `${msg}\n*<${
                    process.env.BASE_URL ?? 'http://localhost:3000'
                  }/post/${post.id}|${
                    this.language === Language.EN
                      ? 'Read on chalmers.it'
                      : 'Läs på chalmers.it'
                  }>*`
                }
              },
              ...content
            ]
          }
        ]
      })
    });
  }
}
