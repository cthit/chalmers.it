import { createHash } from 'node:crypto';
import { expect } from '@playwright/test';
import { test } from './composer';
import {
  field,
  fillNews,
  fillPage,
  publishNews,
  publishPage,
  signIn
} from './helpers/browser';

test.beforeEach(async ({ page, environment }) => {
  await signIn(page, environment);
});

test('creates a news post with English and Swedish content', async ({
  page,
  environment
}) => {
  const title = 'Gamma integration news';
  await fillNews(
    page,
    title,
    'A **published announcement** from our committee.'
  );
  const id = await publishNews(page, title);
  await expect(
    page.getByText('published announcement', { exact: true })
  ).toBeVisible();
  const stored = await environment.db.newsPost.findUniqueOrThrow({
    where: { id }
  });
  expect(stored.status).toBe('PUBLISHED');
  expect(stored.writtenByGammaUserId).toBe(
    '88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f'
  );
  expect(stored.divisionGroupId).not.toBeNull();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: title, exact: true })
  ).toBeVisible();
  expect(stored.titleSv).toBe(`${title} svenska`);
  expect(stored.contentSv).toContain('Svensk text:');
  expect(stored.contentSv).toContain('published announcement');
});

test('creates a page that persists in both languages', async ({
  page,
  environment
}) => {
  await fillPage(
    page,
    'integration-page',
    'Integration page',
    'A **new division page**.'
  );
  await publishPage(page, 'integration-page', 'Integration page');
  await expect(
    page.getByText('new division page', { exact: true })
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Integration page', exact: true })
  ).toBeVisible();
  const stored = await environment.db.divisionPage.findFirstOrThrow({
    where: { slug: 'integration-page' }
  });
  expect(stored.titleSv).toBe('Integration page svenska');
  expect(stored.contentSv).toContain('Svensk text:');
  expect(stored.contentSv).toContain('new division page');
});

for (const kind of ['news', 'page'] as const) {
  test(`uploads and embeds a file when creating ${kind === 'news' ? 'a news post' : 'a page'}`, async ({
    page
  }) => {
    // A complete 1x1 PNG. Verify real bytes through the application's media API.
    const bytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV1sAAAAASUVORK5CYII=',
      'base64'
    );
    const hash = createHash('sha256').update(bytes).digest('base64url');
    const mediaUrl = `/api/media/${hash}`;
    const title = `Uploaded ${kind} illustration`;
    if (kind === 'news')
      await fillNews(page, title, 'An announcement with an upload.');
    else await fillPage(page, 'uploaded-page', title, 'A page with an upload.');

    await page.locator('input[type="file"]').setInputFiles({
      name: 'committee.png',
      mimeType: 'image/png',
      buffer: bytes
    });
    await expect(
      page.getByText('committee.png', { exact: true })
    ).toBeVisible();
    // Exercise the UI's generated link, rather than only constructing one in the test.
    await page
      .context()
      .grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.getByRole('button', { name: 'Copy link', exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(`![Text](${mediaUrl})`);
    const markdown = (
      await page.evaluate(() => navigator.clipboard.readText())
    ).replace('[Text]', '[Committee illustration]');
    // Editors are already in Markdown mode from fillNews/fillPage.
    await field(page, 'Content (Eng)').locator('textarea').fill(markdown);
    await field(page, 'Content (Sv)').locator('textarea').fill(markdown);
    expect((await page.request.get(mediaUrl)).status()).toBe(404);

    if (kind === 'news') await publishNews(page, title);
    else await publishPage(page, 'uploaded-page', title);
    const image = page.getByRole('img', {
      name: 'Committee illustration',
      exact: true
    });
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate(
          (node: HTMLImageElement) => node.complete && node.naturalWidth > 0
        )
      )
      .toBe(true);
    const downloaded = await page.request.get(mediaUrl);
    expect(downloaded.status()).toBe(200);
    expect(downloaded.headers()['content-type']).toContain('image/png');
    expect(await downloaded.body()).toEqual(bytes);
    await page.reload();
    await expect(image).toBeVisible();
  });
}

test('searches published news by title and body and handles no results', async ({
  page
}) => {
  await fillNews(
    page,
    'Orion committee update',
    'Meet at the Zephyr observatory.'
  );
  await publishNews(page, 'Orion committee update');
  await fillNews(
    page,
    'Unrelated lunch update',
    'Sandwiches in the common room.'
  );
  await publishNews(page, 'Unrelated lunch update');
  await page.goto('/en/post/search');
  const query = page.locator('form input[type="text"]');
  const search = page.getByRole('button', { name: 'Search', exact: true });
  for (const term of ['orion', 'ZEPHYR']) {
    await query.fill(term);
    await search.click();
    const result = page.getByRole('link', {
      name: 'Orion committee update',
      exact: true
    });
    await expect(result).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Unrelated lunch update', exact: true })
    ).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`q=${term}`));
  }
  await page
    .getByRole('link', { name: 'Orion committee update', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Orion committee update', exact: true })
  ).toBeVisible();
  await page.goto('/en/post/search');
  await query.fill('thereisnosuchannouncement');
  await search.click();
  await expect(
    page.getByText('No search results', { exact: true })
  ).toBeVisible();
  await query.fill('ab');
  await search.click();
  await expect(
    page.getByText('Search query must be at least 3 characters long', {
      exact: true
    })
  ).toBeVisible();
});
