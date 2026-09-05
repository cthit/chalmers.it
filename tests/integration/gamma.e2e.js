const { test, expect } = require('@playwright/test');

test('signs in through Gamma and reads committee members from Gamma', async ({
  page
}) => {
  await page.goto('/en/groups');
  await page.getByRole('button', { name: /log in|login|sign in/i }).click();
  await page.waitForURL(`${process.env.GAMMA_ROOT_URL}/login**`);
  await page.locator('[name="username"]').fill('mscott');
  await page.locator('[name="password"]').fill('password1337');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  // Gamma may request consent for a newly registered client.
  await Promise.race([
    page.waitForURL(`${process.env.BASE_URL}/**`),
    page.getByRole('button', { name: 'Authorize', exact: true }).waitFor()
  ]);
  if (new URL(page.url()).origin === process.env.GAMMA_ROOT_URL) {
    await page.getByRole('button', { name: 'Authorize', exact: true }).click();
  }
  await page.waitForURL(`${process.env.BASE_URL}/en/groups`);
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
