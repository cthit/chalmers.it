import { Prisma, Language } from '@prisma/client';
import prisma from '@/prisma';
import GammaService from './gammaService';
import DivisionGroupService from './divisionGroupService';
import { MessageAttachment } from '@slack/types';
import htmlToSlack from 'html-to-slack';
import { Marked } from 'marked';
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
  channel?: string;
};

const LOST_MESSAGE_ERRORS = new Set([
  'message_not_found',
  'msg_not_found',
  'channel_not_found'
]);

const FALLBACK_RETRY_ERRORS = new Set([
  'cannot_parse_attachment',
  'invalid_blocks',
  'invalid_blocks_format',
  'msg_too_long',
  'too_long_attachment_text',
  'too_long_text'
]);

// Configuration

function envChannelFor(language: Language): string | undefined {
  return language === Language.SV
    ? process.env.SLACK_CHANNEL_SV
    : process.env.SLACK_CHANNEL_EN;
}

function channelFor(post: NewsPost, language: Language): string | undefined {
  const stored =
    language === Language.SV ? post.slackChannelSv : post.slackChannelEn;
  return stored ?? envChannelFor(language);
}

function tsFor(post: NewsPost, language: Language): string | null {
  return language === Language.SV ? post.slackTsSv : post.slackTsEn;
}

function slackMessageUpdate(
  language: Language,
  ts: string | null,
  channel: string | null
) {
  return language === Language.SV
    ? { slackTsSv: ts, slackChannelSv: channel }
    : { slackTsEn: ts, slackChannelEn: channel };
}

// Slack transport

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
  if (res && !res.ok && FALLBACK_RETRY_ERRORS.has(res.error ?? '')) {
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

async function notifySlackPost(post: NewsPost, language: Language) {
  const channel = envChannelFor(language);
  if (!channel) {
    return null;
  }

  const res = await callSlack('chat.postMessage', post, language, { channel });
  if (res?.ok && res.ts) {
    return { ts: res.ts, channel: res.channel ?? channel };
  }
  return null;
}

async function updateSlackPost(
  post: NewsPost,
  language: Language,
  ts: string
): Promise<string | null> {
  const channel = channelFor(post, language);
  if (!channel) return 'channel_not_configured';

  const res = await callSlack('chat.update', post, language, { channel, ts });
  return res?.ok ? null : (res?.error ?? 'request_failed');
}

async function deleteSlackMessage(channel: string, ts: string) {
  const res = await slackApi('chat.delete', { channel, ts });
  return res?.ok === true;
}

// Message serialization

function escapeSlackMrkdwn(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
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
  const escapedTitle = escapeSlackMrkdwn(title);
  const msg = english
    ? `News published: *${escapedTitle}*${group ? ` for *${group.prettyName}*` : ''} by *${nick}*`
    : `Nyhet publicerad: *${escapedTitle}*${group ? ` för *${group.prettyName}*` : ''} av *${nick}*`;

  let content = [] as ReturnType<typeof htmlToSlack>;
  if (includeContent) {
    const parser = new Marked(
      { pedantic: false, breaks: true, gfm: true },
      baseUrl(BASE_URL())
    );
    const cHtml = await parser.parse(english ? post.contentEn : post.contentSv);
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

// Message lifecycle

async function storeMessageId(
  post: NewsPost,
  language: Language,
  message: { ts: string; channel: string }
) {
  try {
    await prisma.newsPost.update({
      where: { id: post.id },
      data: slackMessageUpdate(language, message.ts, message.channel)
    });
  } catch (error) {
    if (!(await deleteSlackMessage(message.channel, message.ts))) {
      console.error(
        'Failed to delete Slack message after storing its id failed',
        post.id,
        language,
        message.ts
      );
    }
    throw error;
  }
}

async function notifyLanguage(post: NewsPost, language: Language) {
  try {
    const message = await notifySlackPost(post, language);
    if (!message) return;
    await storeMessageId(post, language, message);
  } catch (e) {
    console.error('Failed to notify news post', post.id, language, e);
  }
}

async function updateLanguage(post: NewsPost, language: Language) {
  try {
    const ts = tsFor(post, language);
    if (!ts) return;

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
        data: slackMessageUpdate(language, null, null)
      });
    }
  } catch (e) {
    console.error(
      'Failed to update Slack messages for news post',
      post.id,
      language,
      e
    );
  }
}

async function deleteLanguage(post: NewsPost, language: Language) {
  try {
    const ts = tsFor(post, language);
    const channel = channelFor(post, language);
    if (!ts || !channel) return;

    if (!(await deleteSlackMessage(channel, ts))) {
      console.error(
        'Failed to delete Slack message for news post',
        post.id,
        language,
        ts
      );
    }
  } catch (e) {
    console.error(
      'Failed to delete Slack messages for news post',
      post.id,
      language,
      e
    );
  }
}

async function resyncIfEdited(post: NewsPost) {
  try {
    const current = await prisma.newsPost.findUnique({
      where: { id: post.id }
    });
    if (
      current &&
      (current.titleEn !== post.titleEn ||
        current.titleSv !== post.titleSv ||
        current.contentEn !== post.contentEn ||
        current.contentSv !== post.contentSv)
    ) {
      await NotifyService.updateNewsPost(current);
    }
  } catch (e) {
    console.error('Failed to resync Slack messages', post.id, e);
  }
}

export default class NotifyService {
  static async notifyNewsPost(post: NewsPost) {
    for (const language of LANGUAGES) {
      await notifyLanguage(post, language);
    }
    await resyncIfEdited(post);
  }

  static async updateNewsPost(post: NewsPost) {
    for (const language of LANGUAGES) {
      await updateLanguage(post, language);
    }
  }

  static async deleteNewsPostMessages(post: NewsPost) {
    for (const language of LANGUAGES) {
      await deleteLanguage(post, language);
    }
  }
}
