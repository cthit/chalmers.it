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
const LANGUAGES = [Language.SV, Language.EN] as const;
const BASE_URL = () => process.env.BASE_URL ?? 'http://localhost:3000';

type NewsPost = Prisma.NewsPostGetPayload<{}>;

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

function tsFor(post: NewsPost, language: Language): string | null {
  return language === Language.SV ? post.slackTsSv : post.slackTsEn;
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

export async function serializeNewsPost(
  post: NewsPost,
  language: Language,
  includeContent = true
) {
  const english = language === Language.EN;
  const nick =
    (await GammaService.getNick(post.writtenByGammaUserId)) ||
    (english ? 'Unknown user' : 'Okänd användare');
  const group =
    post.divisionGroupId !== null
      ? await DivisionGroupService.getInfo(post.divisionGroupId)
      : null;
  const title = english ? post.titleEn : post.titleSv;
  const msg = english
    ? `News published: *${post.titleEn}*${group ? ` for *${group.prettyName}*` : ''} by *${nick}*`
    : `Nyhet publicerad: *${post.titleSv}*${group ? ` för *${group.prettyName}*` : ''} av *${nick}*`;

  let content = [] as ReturnType<typeof htmlToSlack>;
  if (includeContent) {
    marked.use({ pedantic: false, breaks: true, gfm: true });
    marked.use(baseUrl(BASE_URL()));
    const cHtml = await marked.parse(english ? post.contentEn : post.contentSv);
    content = cleanSlackBlocks(
      htmlToSlack(cHtml.replaceAll('</p>', '</p><p> </p>'))
    );
  }

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
              text: `*<${BASE_URL()}/post/${post.id}|${english ? 'Read on chalmers.it' : 'Läs på chalmers.it'}>*`
            }
          },
          ...(content.length ? [{ type: 'divider' }, ...content] : [])
        ]
      }
    ] as MessageAttachment[]
  };
}

async function callSlack(
  method: 'chat.postMessage' | 'chat.update',
  post: NewsPost,
  language: Language,
  extra: Record<string, unknown>
): Promise<SlackApiResponse | null> {
  let res = await slackApi(method, {
    ...extra,
    ...(await serializeNewsPost(post, language))
  });
  if (!res?.ok && res && !LOST_MESSAGE_ERRORS.has(res.error ?? '')) {
    console.warn(
      'Falling back to simpler message format for news post',
      post.id,
      res.error
    );
    res = await slackApi(method, {
      ...extra,
      ...(await serializeNewsPost(post, language, false))
    });
  }
  return res;
}

async function notifySlackPost(
  post: NewsPost,
  language: Language
): Promise<string | null> {
  const channel = channelFor(language);
  if (!channel) {
    return null;
  }

  const res = await callSlack('chat.postMessage', post, language, { channel });
  return res?.ok && res.ts ? res.ts : null;
}

async function updateSlackPost(
  post: NewsPost,
  language: Language,
  ts: string
): Promise<string | null> {
  const channel = channelFor(language);
  if (!channel) return 'channel_not_configured';

  const res = await callSlack('chat.update', post, language, { channel, ts });
  return res?.ok ? null : (res?.error ?? 'request_failed');
}

async function deleteSlackMessage(language: Language, ts: string) {
  const channel = channelFor(language);
  if (channel) await slackApi('chat.delete', { channel, ts });
}

export default class NotifyService {
  static async notifyNewsPost(post: NewsPost) {
    try {
      for (const language of LANGUAGES) {
        const ts = await notifySlackPost(post, language);
        if (ts) {
          await prisma.newsPost.update({
            where: { id: post.id },
            data: tsUpdate(language, ts)
          });
        }
      }
    } catch (e) {
      console.error('Failed to notify news post', post.id, e);
    }
  }

  static async updateNewsPost(post: NewsPost) {
    try {
      for (const language of LANGUAGES) {
        const ts = tsFor(post, language);
        if (!ts) continue;

        const error = await updateSlackPost(post, language, ts);
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

  static async deleteNewsPostMessages(post: NewsPost) {
    try {
      for (const language of LANGUAGES) {
        const ts = tsFor(post, language);
        if (ts) await deleteSlackMessage(language, ts);
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
