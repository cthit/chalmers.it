import { expect } from '@playwright/test';
import { test } from './composer';
import { markdownCases } from './fixtures/slack';
import { fillNews, publishNews, signIn } from './helpers/browser';
import { slackErrors, slackText } from './helpers/slack';

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

for (const fixture of markdownCases) {
  test(`publishes valid Slack blocks for ${fixture.name}`, async ({
    page,
    environment
  }, testInfo) => {
    const title = `Markdown: ${fixture.name}`;

    const id =
      await test.step('Publish the Markdown announcement', async () => {
        await fillNews(page, title, fixture.markdown);

        return publishNews(page, title);
      });

    const sent =
      await test.step('Validate the original outgoing notification', async () => {
        await expect
          .poll(() => environment.webhook.requests.length)
          .toBeGreaterThan(0);

        const notification = environment.webhook.requests[0];

        await testInfo.attach('slack-payload.json', {
          body: JSON.stringify(notification.payload, null, 2),
          contentType: 'application/json'
        });

        expect(
          notification.errors,
          'The original notification must be valid; fallback must not hide conversion bugs'
        ).toEqual([]);
        expect(notification.status).toBe(200);

        const text = slackText(notification.payload);
        const expectedText = [
          title,
          'Gamma Smoke Member',
          'digIT',
          ...fixture.expected
        ];

        for (const content of expectedText) {
          expect(text).toContain(content);
        }

        return notification;
      });

    await test.step('Match the English serialization API to the delivered message', async () => {
      const response = await page.request.get(
        `/api/news/${id}?format=slack&lang=en`
      );

      expect(response.status()).toBe(200);

      const serialized = await response.json();

      expect(serialized).toEqual(sent.payload);
      expect(slackErrors(serialized)).toEqual([]);

      for (const path of fixture.expectedPaths ?? []) {
        expect(JSON.stringify(serialized)).toContain(
          `${environment.websiteUrl}${path}`
        );
      }
    });

    await test.step('Validate the Swedish serialization and translated content', async () => {
      const response = await page.request.get(
        `/api/news/${id}?format=slack&lang=sv`
      );

      expect(response.status()).toBe(200);

      const translated = await response.json();
      const text = slackText(translated);

      expect(slackErrors(translated)).toEqual([]);
      expect(text).toContain(`${title} svenska`);
      expect(text).toContain('Svensk text:');
    });
  });
}

test('sends a valid fallback when Slack rejects the initial message', async ({
  page,
  environment
}) => {
  const id =
    await test.step('Publish an announcement with Slack set to reject the first request', async () => {
      environment.webhook.rejectNext();

      await fillNews(
        page,
        'Fallback announcement',
        'Original **notification body**.'
      );

      return publishNews(page, 'Fallback announcement');
    });

  await test.step('Verify the rejected request and the successful fallback', async () => {
    await expect.poll(() => environment.webhook.requests.length).toBe(2);

    const [initial, fallback] = environment.webhook.requests;

    expect(initial.status).toBe(400);
    expect(initial.errors).toEqual([]);

    expect(fallback.status).toBe(200);
    expect(fallback.errors).toEqual([]);
  });

  await test.step('Keep the title, author, and link in the fallback without the body', async () => {
    const fallback = environment.webhook.requests[1];
    const text = slackText(fallback.payload);

    expect(text).toContain('Fallback announcement');
    expect(text).toContain('Gamma Smoke Member');
    expect(JSON.stringify(fallback.payload)).toContain(
      `${environment.websiteUrl}/post/${id}`
    );
    expect(text).not.toContain('notification body');
  });
});

test('keeps Slack headers valid for long news titles and Markdown headings', async ({
  page,
  environment
}) => {
  const title = 'Long announcement '.repeat(10).trim();
  const heading = 'Long content heading '.repeat(10);

  await test.step('Publish a title and Markdown heading beyond the Slack header limit', async () => {
    await fillNews(page, title, `# ${heading}\n\nAnnouncement body.`);
    await publishNews(page, title);
  });

  await test.step('Verify valid headers and preserved announcement content', async () => {
    await expect
      .poll(() => environment.webhook.requests.length)
      .toBeGreaterThan(0);

    const notification = environment.webhook.requests[0];

    expect(notification.errors).toEqual([]);
    expect(notification.status).toBe(200);
    expect(slackText(notification.payload)).toContain('Announcement body.');
  });
});
