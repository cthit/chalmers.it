import NotifyService from '@/services/notifyService';
import prisma from '@/prisma';
import GammaService from '@/services/gammaService';
import DivisionGroupService from '@/services/divisionGroupService';

jest.mock('@prisma/client', () => ({
  Language: { SV: 'SV', EN: 'EN' }
}));

jest.mock('@/prisma', () => ({
  __esModule: true,
  default: {
    newsPost: {
      update: jest.fn(),
      findUnique: jest.fn()
    }
  }
}));

jest.mock('@/services/gammaService', () => ({
  __esModule: true,
  default: {
    getNick: jest.fn().mockResolvedValue('tester')
  }
}));

jest.mock('@/services/divisionGroupService', () => ({
  __esModule: true,
  default: {
    getInfo: jest.fn().mockResolvedValue(null)
  }
}));

jest.mock('marked', () => ({
  Marked: jest.fn().mockImplementation(() => ({
    parse: jest.fn(async (content: string) => `<p>${content}</p>`)
  }))
}));

jest.mock('marked-base-url', () => ({
  baseUrl: () => ({ walkTokens: () => undefined })
}));

jest.mock('html-to-slack', () => ({
  __esModule: true,
  default: jest.fn(() => [
    { type: 'section', text: { type: 'mrkdwn', text: 'content block' } }
  ])
}));

type SlackBody = {
  ok?: boolean;
  error?: string;
  ts?: string;
  channel?: string;
  blocks?: unknown;
  attachments?: Array<{ blocks: unknown[] }>;
};

const fetchMock = jest.fn<
  Promise<Response>,
  [RequestInfo | URL, RequestInit?]
>();

const prismaUpdateMock = prisma.newsPost.update as unknown as jest.Mock;
const prismaFindUniqueMock = prisma.newsPost.findUnique as unknown as jest.Mock;
const getNickMock = GammaService.getNick as unknown as jest.Mock;
const getInfoMock = DivisionGroupService.getInfo as unknown as jest.Mock;

const basePost = {
  id: 42,
  titleSv: 'Hej från digIT',
  titleEn: 'Hello from digIT',
  contentSv: '<p>Svenskt innehåll</p>',
  contentEn: '<p>English content</p>',
  writtenByGammaUserId: 'gamma-user-id',
  scheduledPublish: null,
  status: 'PUBLISHED' as const,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  divisionGroupId: null as number | null,
  mediaSha256: null,
  slackTsSv: null as string | null,
  slackTsEn: null as string | null,
  slackChannelSv: null as string | null,
  slackChannelEn: null as string | null
};

function makePost(overrides: Partial<typeof basePost> = {}) {
  return { ...basePost, ...overrides };
}

function slackResponse(body: SlackBody): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body
  } as unknown as Response;
}

function requestBody(index: number): SlackBody {
  const init = fetchMock.mock.calls[index][1];
  return JSON.parse(String(init?.body));
}

describe('NotifyService', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.clearAllMocks();
    fetchMock.mockReset();
    prismaUpdateMock.mockReset();
    prismaFindUniqueMock.mockReset();
    prismaFindUniqueMock.mockResolvedValue(null);
    getNickMock.mockReset();
    getNickMock.mockResolvedValue('tester');
    getInfoMock.mockReset();
    getInfoMock.mockResolvedValue(null);
    global.fetch = fetchMock as unknown as typeof fetch;
    process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
    process.env.SLACK_CHANNEL_SV = '#sv-news';
    process.env.SLACK_CHANNEL_EN = '#en-news';
    process.env.BASE_URL = 'https://chalmers.it';
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  describe('notifyNewsPost', () => {
    it('posts to both configured channels and stores the message ids', async () => {
      fetchMock
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '111.000001', channel: 'C111' })
        )
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '222.000002', channel: 'C222' })
        );

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://slack.com/api/chat.postMessage'
      );
      expect(requestBody(0)).toMatchObject({ channel: '#sv-news' });
      expect(requestBody(1)).toMatchObject({ channel: '#en-news' });
      expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
        Authorization: 'Bearer xoxb-test-token'
      });

      const blocks = requestBody(0).blocks as Array<{
        text?: { text?: string };
      }>;
      expect(blocks[0].text?.text).toContain('Nyhet publicerad');

      const attachments = requestBody(0).attachments as Array<{
        blocks: Array<{ text?: { text?: string } }>;
      }>;
      expect(attachments[0].blocks[1].text?.text).toBe(
        '*<https://chalmers.it/post/42|Läs på chalmers.it>*'
      );

      expect(prismaUpdateMock).toHaveBeenCalledTimes(2);
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsSv: '111.000001', slackChannelSv: 'C111' }
      });
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsEn: '222.000002', slackChannelEn: 'C222' }
      });
    });

    it('escapes mrkdwn metacharacters in the title', async () => {
      fetchMock
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '111.000001', channel: 'C111' })
        )
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '222.000002', channel: 'C222' })
        );

      await NotifyService.notifyNewsPost(
        makePost({ titleSv: '<!channel> & <b>', titleEn: '<!here> & <i>' })
      );

      const svBlocks = requestBody(0).blocks as Array<{
        text?: { text?: string };
      }>;
      const enBlocks = requestBody(1).blocks as Array<{
        text?: { text?: string };
      }>;
      expect(svBlocks[0].text?.text).toContain(
        '*&lt;!channel&gt; &amp; &lt;b&gt;*'
      );
      expect(svBlocks[0].text?.text).not.toContain('<!channel>');
      expect(enBlocks[0].text?.text).toContain(
        '*&lt;!here&gt; &amp; &lt;i&gt;*'
      );
      expect(enBlocks[0].text?.text).not.toContain('<!here>');

      // The header block is plain_text, so the raw title must survive there.
      const svAttachments = requestBody(0).attachments as Array<{
        blocks: Array<{ type?: string; text?: { text?: string } }>;
      }>;
      expect(svAttachments[0].blocks[0]).toMatchObject({
        type: 'header',
        text: { type: 'plain_text', text: '<!channel> & <b>' }
      });
    });

    it('falls back to a localized unknown-user name when the nick is unavailable', async () => {
      getNickMock.mockResolvedValue('');
      fetchMock
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '111.000001', channel: 'C111' })
        )
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '222.000002', channel: 'C222' })
        );

      await NotifyService.notifyNewsPost(makePost());

      const svBlocks = requestBody(0).blocks as Array<{
        text?: { text?: string };
      }>;
      const enBlocks = requestBody(1).blocks as Array<{
        text?: { text?: string };
      }>;
      expect(svBlocks[0].text?.text).toContain('av *Okänd användare*');
      expect(enBlocks[0].text?.text).toContain('by *Unknown user*');
    });

    it('includes the division group name in the message', async () => {
      getInfoMock.mockResolvedValue({ prettyName: 'digIT' });
      fetchMock
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '111.000001', channel: 'C111' })
        )
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '222.000002', channel: 'C222' })
        );

      await NotifyService.notifyNewsPost(makePost({ divisionGroupId: 7 }));

      const svBlocks = requestBody(0).blocks as Array<{
        text?: { text?: string };
      }>;
      const enBlocks = requestBody(1).blocks as Array<{
        text?: { text?: string };
      }>;
      expect(svBlocks[0].text?.text).toContain('för *digIT*');
      expect(enBlocks[0].text?.text).toContain('for *digIT*');
      expect(getInfoMock).toHaveBeenCalledWith(7);
    });

    it('retries with the fallback payload when Slack rejects the message', async () => {
      fetchMock
        .mockResolvedValueOnce(
          slackResponse({ ok: false, error: 'cannot_parse_attachment' })
        )
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '333.000003', channel: 'C333' })
        )
        .mockResolvedValueOnce(
          slackResponse({ ok: false, error: 'cannot_parse_attachment' })
        )
        .mockResolvedValueOnce(
          slackResponse({ ok: true, ts: '444.000004', channel: 'C444' })
        );

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(4);
      const full = requestBody(0).attachments?.[0].blocks ?? [];
      const fallback = requestBody(1).attachments?.[0].blocks ?? [];
      expect(full.length).toBeGreaterThan(fallback.length);
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsSv: '333.000003', slackChannelSv: 'C333' }
      });
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsEn: '444.000004', slackChannelEn: 'C444' }
      });
    });

    it('does not retry non-formatting errors', async () => {
      fetchMock.mockResolvedValue(
        slackResponse({ ok: false, error: 'ratelimited' })
      );

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(prismaUpdateMock).not.toHaveBeenCalled();
    });

    it('does not retry fatal errors and stores no message ids', async () => {
      fetchMock.mockResolvedValue(
        slackResponse({ ok: false, error: 'channel_not_found' })
      );

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(prismaUpdateMock).not.toHaveBeenCalled();
    });

    it('skips posting when no channel is configured', async () => {
      delete process.env.SLACK_CHANNEL_SV;
      delete process.env.SLACK_CHANNEL_EN;

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).not.toHaveBeenCalled();
      expect(prismaUpdateMock).not.toHaveBeenCalled();
    });

    it('still notifies the other language when one language fails', async () => {
      getNickMock.mockRejectedValueOnce(new Error('gamma unavailable'));
      fetchMock.mockResolvedValue(
        slackResponse({ ok: true, ts: '222.000002', channel: 'C222' })
      );

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(requestBody(0)).toMatchObject({ channel: '#en-news' });
      expect(prismaUpdateMock).toHaveBeenCalledTimes(1);
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsEn: '222.000002', slackChannelEn: 'C222' }
      });
      expect(console.error).toHaveBeenCalledWith(
        'Failed to notify news post',
        42,
        'SV',
        expect.any(Error)
      );
    });

    it('deletes the Slack message when storing its id fails', async () => {
      prismaUpdateMock.mockRejectedValue(new Error('database unavailable'));
      fetchMock.mockImplementation(async (url) => {
        if (String(url).endsWith('chat.delete')) {
          return slackResponse({ ok: true });
        }
        return slackResponse({ ok: true, ts: '111.000001', channel: 'C111' });
      });

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock.mock.calls.map((call) => call[0])).toEqual([
        'https://slack.com/api/chat.postMessage',
        'https://slack.com/api/chat.delete',
        'https://slack.com/api/chat.postMessage',
        'https://slack.com/api/chat.delete'
      ]);
      expect(requestBody(1)).toMatchObject({
        channel: 'C111',
        ts: '111.000001'
      });
      expect(requestBody(3)).toMatchObject({
        channel: 'C111',
        ts: '111.000001'
      });
      expect(console.error).toHaveBeenCalledWith(
        'Failed to notify news post',
        42,
        'SV',
        expect.any(Error)
      );
    });

    it('updates the stored messages when the post changed while posting', async () => {
      const changed = makePost({
        contentEn: '<p>Edited while posting</p>',
        slackTsSv: '111.000001',
        slackChannelSv: 'C111',
        slackTsEn: '222.000002',
        slackChannelEn: 'C222'
      });
      prismaFindUniqueMock.mockResolvedValue(changed);
      fetchMock.mockImplementation(async (url) => {
        if (String(url).endsWith('chat.update')) {
          return slackResponse({ ok: true });
        }
        return slackResponse({ ok: true, ts: '111.000001', channel: 'C111' });
      });

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(4);
      expect(requestBody(2)).toMatchObject({
        channel: 'C111',
        ts: '111.000001'
      });
      expect(requestBody(3)).toMatchObject({
        channel: 'C222',
        ts: '222.000002'
      });
    });

    it('does not resync when the post is unchanged', async () => {
      // The stored ids are present, so an unnecessary resync would issue
      // chat.update calls right after the initial posts.
      prismaFindUniqueMock.mockResolvedValue(
        makePost({
          slackTsSv: '111.000001',
          slackChannelSv: 'C111',
          slackTsEn: '222.000002',
          slackChannelEn: 'C222'
        })
      );
      fetchMock.mockImplementation(async (url) => {
        if (String(url).endsWith('chat.update')) {
          return slackResponse({ ok: true });
        }
        return slackResponse({ ok: true, ts: '111.000001', channel: 'C111' });
      });

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls.map((call) => call[0])).not.toContain(
        'https://slack.com/api/chat.update'
      );
    });
  });

  describe('updateNewsPost', () => {
    it('updates both messages when a published post is edited', async () => {
      fetchMock.mockResolvedValue(slackResponse({ ok: true }));

      await NotifyService.updateNewsPost(
        makePost({
          slackTsSv: '111.000001',
          slackTsEn: '222.000002',
          slackChannelSv: 'C111',
          slackChannelEn: 'C222'
        })
      );

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://slack.com/api/chat.update'
      );
      expect(requestBody(0)).toMatchObject({
        channel: 'C111',
        ts: '111.000001'
      });
      expect(requestBody(1)).toMatchObject({
        channel: 'C222',
        ts: '222.000002'
      });
      expect(prismaUpdateMock).not.toHaveBeenCalled();
    });

    it('falls back to the configured channel when none was stored', async () => {
      fetchMock.mockResolvedValue(slackResponse({ ok: true }));

      await NotifyService.updateNewsPost(makePost({ slackTsSv: '111.000001' }));

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(requestBody(0)).toMatchObject({
        channel: '#sv-news',
        ts: '111.000001'
      });
    });

    it('clears the stored id when the Slack message no longer exists', async () => {
      fetchMock.mockResolvedValue(
        slackResponse({ ok: false, error: 'message_not_found' })
      );

      await NotifyService.updateNewsPost(
        makePost({ slackTsSv: '111.000001', slackChannelSv: 'C111' })
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsSv: null, slackChannelSv: null }
      });
    });

    it('keeps the stored id when Slack fails temporarily', async () => {
      fetchMock.mockResolvedValue(
        slackResponse({ ok: false, error: 'ratelimited' })
      );

      await NotifyService.updateNewsPost(
        makePost({ slackTsSv: '111.000001', slackChannelSv: 'C111' })
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(prismaUpdateMock).not.toHaveBeenCalled();
    });

    it('does nothing for posts without stored message ids', async () => {
      await NotifyService.updateNewsPost(makePost());

      expect(fetchMock).not.toHaveBeenCalled();
      expect(prismaUpdateMock).not.toHaveBeenCalled();
    });
  });

  describe('deleteNewsPostMessages', () => {
    it('deletes both messages of a removed post', async () => {
      fetchMock.mockResolvedValue(slackResponse({ ok: true }));

      await NotifyService.deleteNewsPostMessages(
        makePost({
          slackTsSv: '111.000001',
          slackTsEn: '222.000002',
          slackChannelSv: 'C111',
          slackChannelEn: 'C222'
        })
      );

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://slack.com/api/chat.delete'
      );
      expect(requestBody(0)).toMatchObject({
        channel: 'C111',
        ts: '111.000001'
      });
      expect(requestBody(1)).toMatchObject({
        channel: 'C222',
        ts: '222.000002'
      });
    });

    it('logs when Slack does not confirm the deletion', async () => {
      fetchMock.mockResolvedValue(
        slackResponse({ ok: false, error: 'cant_delete_message' })
      );

      await NotifyService.deleteNewsPostMessages(
        makePost({ slackTsSv: '111.000001', slackChannelSv: 'C111' })
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to delete Slack message for news post',
        42,
        'SV',
        '111.000001'
      );
    });

    it('does nothing for posts without stored message ids', async () => {
      await NotifyService.deleteNewsPostMessages(makePost());

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
