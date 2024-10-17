import { Prisma, NotifierType, Language } from '@prisma/client';
import prisma from '@/prisma';
import GammaService from './gammaService';
import DivisionGroupService from './divisionGroupService';
import { MessageAttachment } from '@slack/types';
import htmlToSlack from 'html-to-slack';
import { marked } from 'marked';
import { baseUrl } from 'marked-base-url';

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

  private cleanSections(blocks: ReturnType<typeof htmlToSlack>) {
    const cleaned = blocks;
    for (const block of cleaned) {
      if (block.type === 'rich_text') {
        for (const sec of block.elements) {
          if (sec.type === 'rich_text_section') {
            sec.elements.forEach((el) => {
              if (el.type === 'text') {
                el.text += '\n';
              }
            });
          }
        }
      }
    }
    return cleaned;
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

    marked.use({
      pedantic: false,
      breaks: true,
      gfm: true
    });
    marked.use(baseUrl(process.env.BASE_URL ?? 'http://localhost:3000'));

    const cHtml = await marked.parse(
      this.language === Language.EN ? post.contentEn : post.contentSv
    );
    const content = this.cleanSections(htmlToSlack(cHtml));

    const msg =
      this.language === Language.EN
        ? `News published: *${post.titleEn}*${group ? ` for *${group.prettyName}*` : ''} by *${nick}*`
        : `Nyhet publicerad: *${post.titleSv}*${group ? ` för *${group.prettyName}*` : ''} av *${nick}*`;

    const res = await fetch(this.webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: msg,
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
                  text: `*<${process.env.BASE_URL ?? 'http://localhost:3000'}/post/${post.id}|${
                    this.language === Language.EN
                      ? 'Read on chalmers.it'
                      : 'Läs på chalmers.it'
                  }>*`
                }
              },
              {
                type: 'divider'
              },
              ...content
            ]
          }
        ] as MessageAttachment[]
      })
    });
    if (!res.ok)
      console.trace(
        'Request failed with response:',
        res.status,
        await res.text()
      );
  }
}
