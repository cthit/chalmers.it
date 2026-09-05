import { expect } from '@playwright/test';
import { test } from './composer';
import { signIn } from './helpers/browser';

test('signs in through Gamma and reads committee members from Gamma', async ({
  page,
  environment
}) => {
  await signIn(page, environment);
  const session = await (await page.request.get('/api/auth/session')).json();
  expect(session.user.id).toBe('88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f');
  expect(session.user.name).toBe('Gamma Smoke Member');
  await page.locator('a[href="/groups/digit"]').click();
  await expect(
    page.getByRole('img', { name: 'Profile Picture', exact: true })
  ).toBeVisible();
  await expect(
    page.getByText('Gamma Smoke Member', { exact: true })
  ).toBeVisible();
  await expect(
    page.getByText('Gamma Smoke Chair', { exact: true })
  ).toBeVisible();
});

test('logs out and removes access to authoring', async ({
  page,
  environment
}) => {
  await signIn(page, environment);
  await page.getByRole('img', { name: 'Profile Picture', exact: true }).click();
  await page
    .getByText('Log out', { exact: true })
    .filter({ visible: true })
    .click();
  await expect(
    page.getByRole('button', { name: /log in|login|sign in/i })
  ).toBeVisible();
  const response = await page.request.get('/api/auth/session');
  expect((await response.json()).user).toBeUndefined();
  await page.goto('/en/post/new');
  await expect(
    page.getByRole('heading', { name: 'Create Post', exact: true })
  ).toHaveCount(0);
  await expect(page.getByText('403', { exact: true })).toBeVisible();
  await page.goto('/en/pages/new');
  await expect(
    page.getByRole('heading', { name: 'Create page', exact: true })
  ).toHaveCount(0);
  await expect(page.getByText('403', { exact: true })).toBeVisible();
});
