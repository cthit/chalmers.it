import { Prisma, Language } from '@prisma/client';
import prisma from '@/prisma';
import GammaService from './gammaService';
import DivisionGroupService from './divisionGroupService';
import { MessageAttachment } from '@slack/types';
import htmlToSlack from 'html-to-slack';
import { marked } from 'marked';
import { baseUrl } from 'marked-base-url';
import { cleanSlackBlocks, slackHeaderText } from '@/utils/slackBlocks';

const SLACK_API_BASE = 'https://slack.com/api/';

type SlackApiResponse = {
  ok?: boolean;
  error?: string;
  ts?: string;
};

const LOST_MESSAGE_ERRORS = new Set([
  'message_not_found',
  'msg_not_found',
  'channel_not_found'
]);

function channelFor(language: Language): string | undefined {
  return language === Language.SV
    ? process.env.SLACK_CHANNEL_SV
    : process.env.SLACK_CHANNEL_EN;
}

function tsUpdate(language: Language, ts: string | null) {
  return language === Language.SV ? { slackTsSv: ts } : { slackTsEn: ts };
}

async function slackApi(
  method: string,
  payload: Record<string, unknown>
): Promise<SlackApiResponse | null> {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    console.warn('SLACK_BOT_TOKEN is not set, skipping Slack call', method);
    return null;
  }

  try {
    const res = await fetch(SLACK_API_BASE + method, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });
    const body = (await res.json()) as SlackApiResponse;
    if (!res.ok || body.ok !== true) {
      console.error(
        'Slack API',
        method,
        'failed with status',
        res.status,
        'and error',
        body.error ?? JSON.stringify(body)
      );
    }
    return body;
  } catch (e) {
    console.error('Slack API', method, 'failed:', e);
    return null;
  }
}

export default class NotifyService {
  static async notifyNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    try {
      for (const language of [Language.SV, Language.EN]) {
        const ts = await new SlackNotifier(language).notifyNewsPost(post);
        if (!ts) continue;
        await prisma.newsPost.update({
          where: { id: post.id },
          data: tsUpdate(language, ts)
        });
      }
    } catch (e) {
      console.error('Failed to notify news post', post.id, e);
    }
  }

  static async updateNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
    try {
      for (const language of [Language.SV, Language.EN]) {
        const ts = language === Language.SV ? post.slackTsSv : post.slackTsEn;
        if (!ts) continue;

        const error = await new SlackNotifier(language).updateNewsPost(
          post,
          ts
        );
        if (error && LOST_MESSAGE_ERRORS.has(error)) {
          console.warn(
            'Clearing lost Slack message ts for news post',
            post.id,
            language,
            error
          );
          await prisma.newsPost.update({
            where: { id: post.id },
            data: tsUpdate(language, null)
          });
        }
      }
    } catch (e) {
      console.error(
        'Failed to update Slack messages for news post',
        post.id,
        e
      );
    }
  }

  static async deleteNewsPostMessages(post: Prisma.NewsPostGetPayload<{}>) {
    try {
      for (const language of [Language.SV, Language.EN]) {
        const ts = language === Language.SV ? post.slackTsSv : post.slackTsEn;
        if (!ts) continue;
        await new SlackNotifier(language).deleteMessage(ts);
      }
    } catch (e) {
      console.error(
        'Failed to delete Slack messages for news post',
        post.id,
        e
      );
    }
  }
}

class SlackNotifier {
  public readonly language: Language;

  public constructor(language: Language) {
    this.language = language;
  }

  private get channel() {
    return channelFor(this.language);
  }

  public async serializeNewsPost(post: Prisma.NewsPostGetPayload<{}>) {
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
    const content = cleanSlackBlocks(
      htmlToSlack(cHtml.replaceAll('</p>', '</p><p> </p>'))
    );

    const msg =
      this.language === Language.EN
        ? `News published: *${post.titleEn}*${group ? ` for *${group.prettyName}*` : ''} by *${nick}*`
        : `Nyhet publicerad: *${post.titleSv}*${group ? ` för *${group.prettyName}*` : ''} av *${nick}*`;

    return {
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
              type: 'header',
              text: {
                type: 'plain_text',
                text: slackHeaderText(title)
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
    };
  }

  async serializeNewsPostFallback(post: Prisma.NewsPostGetPayload<{}>) {
    const nick =
      (await GammaService.getNick(post.writtenByGammaUserId)) ||
      (this.language === Language.EN ? 'Unknown user' : 'Okänd användare');
    const group =
      post.divisionGroupId !== null
        ? await DivisionGroupService.getInfo(post.divisionGroupId)
        : null;
    const title = this.language === Language.EN ? post.titleEn : post.titleSv;
    const msg =
      this.language === Language.EN
        ? `News published: *${post.titleEn}*${group ? ` for *${group.prettyName}*` : ''} by *${nick}*`
        : `Nyhet publicerad: *${post.titleSv}*${group ? ` för *${group.prettyName}*` : ''} av *${nick}*`;

    return {
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
              type: 'header',
              text: {
                type: 'plain_text',
                text: slackHeaderText(title)
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
            }
          ]
        }
      ] as MessageAttachment[]
    };
  }

  async notifyNewsPost(
    post: Prisma.NewsPostGetPayload<{}>
  ): Promise<string | null> {
    const channel = this.channel;
    if (!channel) {
      console.warn(
        'No Slack channel configured for language',
        this.language,
        '- skipping news post',
        post.id
      );
      return null;
    }

    let res = await slackApi('chat.postMessage', {
      channel,
      ...(await this.serializeNewsPost(post))
    });
    if (!res?.ok && res && !LOST_MESSAGE_ERRORS.has(res.error ?? '')) {
      console.warn(
        'Falling back to simpler message format for news post',
        post.id,
        res.error
      );
      res = await slackApi('chat.postMessage', {
        channel,
        ...(await this.serializeNewsPostFallback(post))
      });
    }

    if (!res?.ok || !res.ts) return null;
    return res.ts;
  }

  async updateNewsPost(
    post: Prisma.NewsPostGetPayload<{}>,
    ts: string
  ): Promise<string | null> {
    const channel = this.channel;
    if (!channel) return 'channel_not_configured';

    let res = await slackApi('chat.update', {
      channel,
      ts,
      ...(await this.serializeNewsPost(post))
    });
    if (!res?.ok && res && !LOST_MESSAGE_ERRORS.has(res.error ?? '')) {
      res = await slackApi('chat.update', {
        channel,
        ts,
        ...(await this.serializeNewsPostFallback(post))
      });
    }

    if (res?.ok) return null;
    return res?.error ?? 'request_failed';
  }

  async deleteMessage(ts: string): Promise<void> {
    const channel = this.channel;
    if (!channel) return;

    await slackApi('chat.delete', { channel, ts });
  }
}

export { SlackNotifier };
