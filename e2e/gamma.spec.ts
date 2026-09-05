import { expect } from '@playwright/test';
import { test } from './composer';

test('signs in through Gamma and reads committee members from Gamma', async ({
  page,
  environment
}) => {
  await page.goto('/en/groups');
  await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  await page.waitForURL(`${environment.gammaUrl}/login**`);
  await page.locator('[name="username"]').fill('mscott');
  await page.locator('[name="password"]').fill('password1337');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  // Gamma may request consent for a newly registered client.
  await Promise.race([
    page.waitForURL(`${environment.websiteUrl}/**`),
    page.getByRole('button', { name: 'Authorize', exact: true }).waitFor()
  ]);
  if (new URL(page.url()).origin === environment.gammaUrl) {
    await page.getByRole('button', { name: 'Authorize', exact: true }).click();
  }
  await page.waitForURL(`${environment.websiteUrl}/en/groups`);
  await expect(
    page.getByRole('img', { name: 'Profile Picture', exact: true })
  ).toBeVisible();
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
