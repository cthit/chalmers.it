import { expect } from '@playwright/test';
import { test } from './composer';
import { signIn } from './helpers/browser';

test('signs in through Gamma and reads committee members from Gamma', async ({
  page,
  environment
}) => {
  await test.step('Sign in through Gamma and verify the website session', async () => {
    await signIn(page, environment);

    const response = await page.request.get('/api/auth/session');
    const session = await response.json();

    expect(session.user.id).toBe('88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f');
    expect(session.user.name).toBe('Gamma Smoke Member');
  });

  await test.step('Open the committee and verify its Gamma member and role', async () => {
    await page
      .getByRole('listitem')
      .getByRole('link', { name: 'digIT', exact: true })
      .click();

    await expect(
      page.getByRole('img', { name: 'Profile Picture', exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Gamma Smoke Member', exact: true })
    ).toBeVisible();
    await expect(
      page.getByText('Gamma Smoke Chair', { exact: true })
    ).toBeVisible();
  });
});

test('logs out and removes access to authoring', async ({
  page,
  environment
}) => {
  await signIn(page, environment);

  await test.step('Log out through the profile menu', async () => {
    await page
      .getByRole('img', { name: 'Profile Picture', exact: true })
      .click();

    // LogoutLink renders an anchor without href, so it has no link role.
    // The header contains separate desktop and mobile copies.
    await page
      .getByText('Log out', { exact: true })
      .filter({ visible: true })
      .click();

    await expect(
      page.getByRole('button', { name: /log in|login|sign in/i })
    ).toBeVisible();
  });

  await test.step('Verify that the authenticated session is cleared', async () => {
    const response = await page.request.get('/api/auth/session');
    const session = await response.json();

    expect(session.user).toBeUndefined();
  });

  await test.step('Deny access to news creation', async () => {
    await page.goto('/en/post/new');

    await expect(
      page.getByRole('heading', { name: 'Create Post', exact: true })
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: '403', exact: true })
    ).toBeVisible();
  });

  await test.step('Deny access to page creation', async () => {
    await page.goto('/en/pages/new');

    await expect(
      page.getByRole('heading', { name: 'Create page', exact: true })
    ).toHaveCount(0);
    await expect(
      page.getByRole('heading', { name: '403', exact: true })
    ).toBeVisible();
  });
});
