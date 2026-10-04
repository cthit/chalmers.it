import { createHash } from 'node:crypto';
import { expect } from '@playwright/test';
import { test } from './composer';
import { committeeImage } from './fixtures/upload';
import {
  fillContent,
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

  const id =
    await test.step('Write and publish a committee announcement', async () => {
      await fillNews(
        page,
        title,
        'A **published announcement** from our committee.'
      );

      return publishNews(page, title);
    });

  await test.step('Verify the rendered announcement survives a reload', async () => {
    await expect(
      page.getByText('published announcement', { exact: true })
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole('heading', { name: title, exact: true })
    ).toBeVisible();
    await expect(
      page.getByText('published announcement', { exact: true })
    ).toBeVisible();
  });

  await test.step('Verify the saved author, committee, and translated content', async () => {
    const stored = await environment.db.newsPost.findUniqueOrThrow({
      where: { id }
    });

    expect(stored.status).toBe('PUBLISHED');
    expect(stored.writtenByGammaUserId).toBe(
      '88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f'
    );
    expect(stored.divisionGroupId).not.toBeNull();

    expect(stored.titleEn).toBe(title);
    expect(stored.contentEn).toContain('published announcement');
    expect(stored.titleSv).toBe(`${title} svenska`);
    expect(stored.contentSv).toContain('Svensk text:');
    expect(stored.contentSv).toContain('published announcement');
  });
});

test('creates a page that persists in both languages', async ({
  page,
  environment
}) => {
  const title = 'Integration page';
  const slug = 'integration-page';

  await test.step('Write and publish a division page', async () => {
    await fillPage(page, slug, title, 'A **new division page**.');
    await publishPage(page, slug, title);
  });

  await test.step('Verify the rendered page survives a reload', async () => {
    await expect(
      page.getByText('new division page', { exact: true })
    ).toBeVisible();

    await page.reload();

    await expect(
      page.getByRole('heading', { name: title, exact: true })
    ).toBeVisible();
    await expect(
      page.getByText('new division page', { exact: true })
    ).toBeVisible();
  });

  await test.step('Verify both saved language versions', async () => {
    const stored = await environment.db.divisionPage.findFirstOrThrow({
      where: { slug }
    });

    expect(stored.titleEn).toBe(title);
    expect(stored.contentEn).toContain('new division page');
    expect(stored.titleSv).toBe(`${title} svenska`);
    expect(stored.contentSv).toContain('Svensk text:');
    expect(stored.contentSv).toContain('new division page');
  });
});

for (const kind of ['news', 'page'] as const) {
  const description = kind === 'news' ? 'a news post' : 'a page';

  test(`uploads and embeds a file when creating ${description}`, async ({
    page
  }) => {
    const hash = createHash('sha256')
      .update(committeeImage.buffer)
      .digest('base64url');
    const mediaUrl = `/api/media/${hash}`;
    const title = `Uploaded ${kind} illustration`;
    const image = page.getByRole('img', {
      name: 'Committee illustration',
      exact: true
    });

    await test.step('Prepare the content for publication', async () => {
      if (kind === 'news') {
        await fillNews(page, title, 'An announcement with an upload.');
      } else {
        await fillPage(page, 'uploaded-page', title, 'A page with an upload.');
      }
    });

    await test.step('Select an image through the upload button', async () => {
      const fileChooserPromise = page.waitForEvent('filechooser');

      await page
        .getByRole('button', { name: 'Select files', exact: true })
        .click();

      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(committeeImage);

      await expect(
        page.getByText('committee.png', { exact: true })
      ).toBeVisible();
    });

    await test.step('Copy the generated link and embed it in both languages', async () => {
      await page
        .context()
        .grantPermissions(['clipboard-read', 'clipboard-write']);
      await page
        .getByRole('button', { name: 'Copy link', exact: true })
        .click();

      await expect
        .poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(`![Text](${mediaUrl})`);

      const copiedLink = await page.evaluate(() =>
        navigator.clipboard.readText()
      );
      const markdown = copiedLink.replace('[Text]', '[Committee illustration]');

      await fillContent(page, 'Eng', markdown);
      await fillContent(page, 'Sv', markdown);

      const unpublishedMedia = await page.request.get(mediaUrl);
      expect(unpublishedMedia.status()).toBe(404);
    });

    await test.step('Publish the content and verify the image loads', async () => {
      if (kind === 'news') {
        await publishNews(page, title);
      } else {
        await publishPage(page, 'uploaded-page', title);
      }

      await expect(image).toBeVisible();
      await expect
        .poll(() =>
          image.evaluate(
            (node: HTMLImageElement) => node.complete && node.naturalWidth > 0
          )
        )
        .toBe(true);
    });

    await test.step('Verify the published file bytes and reload persistence', async () => {
      const downloaded = await page.request.get(mediaUrl);

      expect(downloaded.status()).toBe(200);
      expect(downloaded.headers()['content-type']).toContain('image/png');
      expect(await downloaded.body()).toEqual(committeeImage.buffer);

      await page.reload();

      await expect(image).toBeVisible();
    });
  });
}

test('searches published news by title and body and handles no results', async ({
  page
}) => {
  const title = 'Orion committee update';

  // Search and date filters have no accessible names. Narrow the textbox
  // role to the text input, excluding the datetime-local filters.
  const query = page
    .getByRole('textbox')
    .and(page.locator('input[type="text"]'));
  const search = page.getByRole('button', { name: 'Search', exact: true });
  const result = page.getByRole('link', { name: title, exact: true });

  await test.step('Publish a matching announcement and an unrelated announcement', async () => {
    await fillNews(page, title, 'Meet at the Zephyr observatory.');
    await publishNews(page, title);

    await fillNews(
      page,
      'Unrelated lunch update',
      'Sandwiches in the common room.'
    );
    await publishNews(page, 'Unrelated lunch update');

    await page.goto('/en/post/search');
  });

  for (const term of ['orion', 'ZEPHYR']) {
    await test.step(`Search for "${term}" and exclude unrelated content`, async () => {
      await query.fill(term);
      await search.click();

      await expect(result).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'Unrelated lunch update', exact: true })
      ).toHaveCount(0);
      await expect(page).toHaveURL(new RegExp(`q=${term}`));
    });
  }

  await test.step('Follow the search result to the announcement', async () => {
    await result.click();

    await expect(
      page.getByRole('heading', { name: title, exact: true })
    ).toBeVisible();
  });

  await test.step('Show an empty result for an unmatched query', async () => {
    await page.goto('/en/post/search');
    await query.fill('thereisnosuchannouncement');
    await search.click();

    await expect(
      page.getByText('No search results', { exact: true })
    ).toBeVisible();
  });

  await test.step('Reject a query shorter than three characters', async () => {
    await query.fill('ab');
    await search.click();

    await expect(
      page.getByText('Search query must be at least 3 characters long', {
        exact: true
      })
    ).toBeVisible();
  });
});
