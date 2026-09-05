import { expect } from '@playwright/test';
import { test } from './composer';
import { fillNews, publishNews, signIn } from './helpers/browser';
import { slackErrors, slackText } from './helpers/slack';

const cases = [
  {
    name: 'inline styles and paragraphs',
    markdown:
      'A **bold announcement** with *italic words*, ~~old text~~ and `inline code`.\n\nSecond paragraph.',
    expected: [
      'bold announcement',
      'italic words',
      'inline code',
      'Second paragraph'
    ]
  },
  {
    name: 'nested lists and blockquotes',
    markdown:
      '- First item\n  - Nested item\n\n1. Ordered item\n2. Next item\n\n> Quoted **committee message**\n>\n> Another quoted paragraph.',
    expected: [
      'First item',
      'Nested item',
      'Ordered item',
      'committee message',
      'Another quoted paragraph'
    ]
  },
  {
    name: 'headings and fenced code',
    markdown:
      '# Release notes\n\n```js\nconst ready = true;\nconsole.log(ready);\n```\n\n---\n\nAll done.',
    expected: ['Release notes', 'const ready = true;', 'All done']
  },
  {
    name: 'relative links and images',
    markdown:
      '[Committee page](/groups/digit)\n\n![Committee logo](/itlogo.svg)',
    expected: ['Committee page', 'Committee logo']
  },
  {
    name: 'blank lines and Swedish characters',
    markdown: '\n\nRäksmörgås & välkommen 🎉\n\n\nEn rad.  \nNästa rad.\n\n',
    expected: ['Räksmörgås & välkommen 🎉', 'Nästa rad.']
  }
];

test.beforeEach(async ({ page, environment }) => {
  await signIn(page, environment);
  await environment.db.eventNotifiers.create({
    data: {
      type: 'SLACK',
      language: 'EN',
      url: environment.webhook.url
    }
  });
});

for (const fixture of cases) {
  test(`publishes valid Slack blocks for ${fixture.name}`, async ({
    page,
    environment
  }, testInfo) => {
    const title = `Markdown: ${fixture.name}`;
    await fillNews(page, title, fixture.markdown);
    const id = await publishNews(page, title);
    await expect
      .poll(() => environment.webhook.requests.length)
      .toBeGreaterThan(0);
    const sent = environment.webhook.requests[0];
    await testInfo.attach('slack-payload.json', {
      body: JSON.stringify(sent.payload, null, 2),
      contentType: 'application/json'
    });
    expect(
      sent.errors,
      'The original notification must be valid; fallback must not hide conversion bugs'
    ).toEqual([]);
    expect(sent.status).toBe(200);
    const text = slackText(sent.payload);
    for (const content of [
      title,
      'Gamma Smoke Member',
      'digIT',
      ...fixture.expected
    ])
      expect(text).toContain(content);
    const response = await page.request.get(
      `/api/news/${id}?format=slack&lang=en`
    );
    expect(response.status()).toBe(200);
    const serialized = await response.json();
    expect(serialized).toEqual(sent.payload);
    expect(slackErrors(serialized)).toEqual([]);
    if (fixture.name === 'relative links and images') {
      expect(JSON.stringify(serialized)).toContain(
        `${environment.websiteUrl}/groups/digit`
      );
      expect(JSON.stringify(serialized)).toContain(
        `${environment.websiteUrl}/itlogo.svg`
      );
    }
    const swedish = await page.request.get(
      `/api/news/${id}?format=slack&lang=sv`
    );
    expect(swedish.status()).toBe(200);
    const translated = await swedish.json();
    expect(slackErrors(translated)).toEqual([]);
    expect(slackText(translated)).toContain(`${title} svenska`);
    expect(slackText(translated)).toContain('Svensk text:');
  });
}

test('sends a valid fallback when Slack rejects the initial message', async ({
  page,
  environment
}) => {
  environment.webhook.rejectNext();
  await fillNews(
    page,
    'Fallback announcement',
    'Original **notification body**.'
  );
  const id = await publishNews(page, 'Fallback announcement');
  await expect.poll(() => environment.webhook.requests.length).toBe(2);
  const [initial, fallback] = environment.webhook.requests;
  expect(initial.status).toBe(400);
  expect(initial.errors).toEqual([]);
  expect(fallback.status).toBe(200);
  expect(fallback.errors).toEqual([]);
  expect(slackText(fallback.payload)).toContain('Fallback announcement');
  expect(slackText(fallback.payload)).toContain('Gamma Smoke Member');
  expect(JSON.stringify(fallback.payload)).toContain(
    `${environment.websiteUrl}/post/${id}`
  );
  expect(slackText(fallback.payload)).not.toContain('notification body');
});

test('keeps Slack headers valid for long news titles and Markdown headings', async ({
  page,
  environment
}) => {
  const title = 'Long announcement '.repeat(10).trim();
  const heading = 'Long content heading '.repeat(10);
  await fillNews(page, title, `# ${heading}\n\nAnnouncement body.`);
  await publishNews(page, title);
  await expect
    .poll(() => environment.webhook.requests.length)
    .toBeGreaterThan(0);
  expect(environment.webhook.requests[0].errors).toEqual([]);
  expect(slackText(environment.webhook.requests[0].payload)).toContain(
    'Announcement body.'
  );
});
