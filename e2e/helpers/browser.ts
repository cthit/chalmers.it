import { expect, type Page } from '@playwright/test';
import type { Environment } from '../composer';
import { logInToGamma } from './gamma';

export async function signIn(page: Page, environment: Environment) {
  await page.goto('/en/groups');
  await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  await page.waitForURL(`${environment.gammaUrl}/login**`);

  await logInToGamma(page, 'mscott');

  const authorize = page.getByRole('button', {
    name: 'Authorize',
    exact: true
  });

  // Gamma can redirect immediately when this user has already granted consent.
  await expect
    .poll(async () => {
      const returnedToWebsite =
        new URL(page.url()).origin === environment.websiteUrl;

      return returnedToWebsite || (await authorize.isVisible());
    })
    .toBe(true);

  if (new URL(page.url()).origin === environment.gammaUrl) {
    await authorize.click();
  }

  await page.waitForURL(`${environment.websiteUrl}/en/groups`);

  await expect(
    page.getByRole('img', { name: 'Profile Picture', exact: true })
  ).toBeVisible();
}

// Authoring controls use adjacent headings without label associations.
// Use the heading to scope the field, then select the control by its role.
function fieldAfterHeading(page: Page, heading: string) {
  return page
    .getByRole('heading', { name: heading, exact: true })
    .locator('xpath=following-sibling::*[1]');
}

function textboxAfterHeading(page: Page, heading: string) {
  return page.getByRole('textbox').and(fieldAfterHeading(page, heading));
}

export async function fillContent(
  page: Page,
  language: 'Eng' | 'Sv',
  markdown: string
) {
  const editor = fieldAfterHeading(page, `Content (${language})`);

  await editor.getByRole('button', { name: 'Markdown', exact: true }).click();
  await editor.getByRole('textbox').fill(markdown);
}

export async function fillNews(page: Page, title: string, markdown: string) {
  await page.goto('/en/post/new');

  await expect(
    page.getByRole('heading', { name: 'Create Post', exact: true })
  ).toBeVisible();

  const committee = page
    .getByRole('combobox')
    .and(fieldAfterHeading(page, 'Create as'));

  await committee.selectOption({ label: 'digIT' });
  await textboxAfterHeading(page, 'Title (Eng)').fill(title);
  await textboxAfterHeading(page, 'Title (Sv)').fill(`${title} svenska`);

  await fillContent(page, 'Eng', markdown);
  await fillContent(page, 'Sv', `Svensk text: ${markdown}`);
}

export async function publishNews(page: Page, title: string) {
  await page.getByRole('button', { name: 'Create', exact: true }).click();

  await expect(
    page.getByRole('heading', { name: 'Create Post', exact: true })
  ).toHaveCount(0);

  const link = page.getByRole('link', { name: title, exact: true });

  await expect(link).toBeVisible();

  const href = await link.getAttribute('href');

  expect(href).toMatch(/\/post\/\d+$/);

  await link.click();

  await expect(
    page.getByRole('heading', { name: title, exact: true })
  ).toBeVisible();

  return Number(href!.split('/').at(-1));
}

export async function fillPage(
  page: Page,
  slug: string,
  title: string,
  markdown: string
) {
  await page.goto('/en/pages/new');

  await expect(
    page.getByRole('heading', { name: 'Create page', exact: true })
  ).toBeVisible();

  await textboxAfterHeading(page, 'URL-slug').fill(slug);
  await textboxAfterHeading(page, 'Title (Eng)').fill(title);
  await textboxAfterHeading(page, 'Title (Sv)').fill(`${title} svenska`);

  await fillContent(page, 'Eng', markdown);
  await fillContent(page, 'Sv', `Svensk text: ${markdown}`);
}

export async function publishPage(page: Page, slug: string, title: string) {
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.waitForURL(/\/groups$/);

  await page.goto(`/en/pages/${slug}`);

  await expect(
    page.getByRole('heading', { name: title, exact: true })
  ).toBeVisible();
}
