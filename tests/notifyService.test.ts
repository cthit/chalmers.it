import NotifyService from '@/services/notifyService';
import prisma from '@/prisma';

jest.mock('@prisma/client', () => ({
  Language: { SV: 'SV', EN: 'EN' }
}));

jest.mock('@/prisma', () => ({
  __esModule: true,
  default: {
    newsPost: {
      update: jest.fn()
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
  marked: {
    use: jest.fn(),
    parse: jest.fn(async (content: string) => `<p>${content}</p>`)
  }
}));

jest.mock('marked-base-url', () => ({
  baseUrl: () => () => undefined
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
  divisionGroupId: null,
  mediaSha256: null,
  slackTsSv: null as string | null,
  slackTsEn: null as string | null
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
        .mockResolvedValueOnce(slackResponse({ ok: true, ts: '111.000001' }))
        .mockResolvedValueOnce(slackResponse({ ok: true, ts: '222.000002' }));

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

      expect(prismaUpdateMock).toHaveBeenCalledTimes(2);
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsSv: '111.000001' }
      });
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsEn: '222.000002' }
      });
    });

    it('retries with the fallback payload when Slack rejects the message', async () => {
      fetchMock
        .mockResolvedValueOnce(
          slackResponse({ ok: false, error: 'cannot_parse_attachment' })
        )
        .mockResolvedValueOnce(slackResponse({ ok: true, ts: '333.000003' }))
        .mockResolvedValueOnce(
          slackResponse({ ok: false, error: 'cannot_parse_attachment' })
        )
        .mockResolvedValueOnce(slackResponse({ ok: true, ts: '444.000004' }));

      await NotifyService.notifyNewsPost(makePost());

      expect(fetchMock).toHaveBeenCalledTimes(4);
      const full = requestBody(0).attachments?.[0].blocks ?? [];
      const fallback = requestBody(1).attachments?.[0].blocks ?? [];
      expect(full.length).toBeGreaterThan(fallback.length);
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsSv: '333.000003' }
      });
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsEn: '444.000004' }
      });
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
  });

  describe('updateNewsPost', () => {
    it('updates both messages when a published post is edited', async () => {
      fetchMock.mockResolvedValue(slackResponse({ ok: true }));

      await NotifyService.updateNewsPost(
        makePost({ slackTsSv: '111.000001', slackTsEn: '222.000002' })
      );

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://slack.com/api/chat.update'
      );
      expect(requestBody(0)).toMatchObject({
        channel: '#sv-news',
        ts: '111.000001'
      });
      expect(requestBody(1)).toMatchObject({
        channel: '#en-news',
        ts: '222.000002'
      });
      expect(prismaUpdateMock).not.toHaveBeenCalled();
    });

    it('clears the stored id when the Slack message no longer exists', async () => {
      fetchMock.mockResolvedValue(
        slackResponse({ ok: false, error: 'message_not_found' })
      );

      await NotifyService.updateNewsPost(
        makePost({ slackTsSv: '111.000001', slackTsEn: null })
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(prismaUpdateMock).toHaveBeenCalledWith({
        where: { id: 42 },
        data: { slackTsSv: null }
      });
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
        makePost({ slackTsSv: '111.000001', slackTsEn: '222.000002' })
      );

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock.mock.calls[0][0]).toBe(
        'https://slack.com/api/chat.delete'
      );
      expect(requestBody(0)).toMatchObject({
        channel: '#sv-news',
        ts: '111.000001'
      });
      expect(requestBody(1)).toMatchObject({
        channel: '#en-news',
        ts: '222.000002'
      });
    });

    it('does nothing for posts without stored message ids', async () => {
      await NotifyService.deleteNewsPostMessages(makePost());

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
