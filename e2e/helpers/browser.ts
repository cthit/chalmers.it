import { expect, type Page } from '@playwright/test';
import type { Environment } from '../composer';

export async function signIn(page: Page, environment: Environment) {
  await page.goto('/en/groups');
  await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  await page.waitForURL(`${environment.gammaUrl}/login**`);
  await page.locator('[name="username"]').fill('mscott');
  await page.locator('[name="password"]').fill('password1337');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect
    .poll(
      async () =>
        new URL(page.url()).origin === environment.websiteUrl ||
        (await page
          .getByRole('button', { name: 'Authorize', exact: true })
          .isVisible())
    )
    .toBe(true);
  if (new URL(page.url()).origin === environment.gammaUrl) {
    await page.getByRole('button', { name: 'Authorize', exact: true }).click();
  }
  await page.waitForURL(`${environment.websiteUrl}/en/groups`);
  await expect(
    page.getByRole('img', { name: 'Profile Picture', exact: true })
  ).toBeVisible();
}

// The production forms have heading-based fields rather than label associations.
// Scope to the field immediately following its visible heading, never CSS classes.
export function field(page: Page, heading: string) {
  return page
    .getByRole('heading', { name: heading, exact: true })
    .locator('xpath=following-sibling::*[1]');
}

export async function fillContent(
  page: Page,
  language: 'Eng' | 'Sv',
  markdown: string
) {
  const editor = field(page, `Content (${language})`);
  await editor.getByRole('button', { name: 'Markdown', exact: true }).click();
  await editor.locator('textarea').fill(markdown);
}

export async function fillNews(page: Page, title: string, markdown: string) {
  await page.goto('/en/post/new');
  await expect(
    page.getByRole('heading', { name: 'Create Post', exact: true })
  ).toBeVisible();
  await field(page, 'Create as').selectOption({ label: 'digIT' });
  await field(page, 'Title (Eng)').fill(title);
  await field(page, 'Title (Sv)').fill(`${title} svenska`);
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
  await field(page, 'URL-slug').fill(slug);
  await field(page, 'Title (Eng)').fill(title);
  await field(page, 'Title (Sv)').fill(`${title} svenska`);
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
