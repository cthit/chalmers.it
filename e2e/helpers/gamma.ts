import { expect, type Browser, type Page } from '@playwright/test';

export async function logInToGamma(page: Page, username: string) {
  await page
    .getByRole('textbox', { name: 'Cid / Email', exact: true })
    .fill(username);
  await page
    .getByRole('textbox', { name: 'Password', exact: true })
    .fill('password1337');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
}

export async function provisionGammaClient(
  browser: Browser,
  gammaUrl: string,
  websiteUrl: string,
  apiKeyId: string
) {
  const context = await browser.newContext();
  let page: Page | undefined;

  try {
    page = await context.newPage();
    page.setDefaultTimeout(20000);

    await page.goto(`${gammaUrl}/login`);
    await logInToGamma(page, 'admin');

    await expect(page.getByText('Hey, admin!')).toBeVisible();

    const credentials = await createOAuthClient(page, gammaUrl, websiteUrl);

    await enableCommitteeInfo(page, gammaUrl, apiKeyId);

    return credentials;
  } catch (error) {
    console.error(
      'Gamma client setup page:',
      await page?.getByRole('main').innerText()
    );

    throw error;
  } finally {
    await context.close();
  }
}

async function createOAuthClient(
  page: Page,
  gammaUrl: string,
  websiteUrl: string
) {
  await page.goto(`${gammaUrl}/clients/create`);

  await page
    .getByRole('textbox', { name: 'Pretty name', exact: true })
    .fill('Website smoke test');
  await page
    .getByRole('textbox', { name: 'Swedish description', exact: true })
    .fill('Lokalt integrationstest');
  await page
    .getByRole('textbox', { name: 'English description', exact: true })
    .fill('Local integration test');
  await page
    .getByRole('textbox', { name: 'Redirect url', exact: true })
    .fill(`${websiteUrl}/api/auth/callback/gamma`);

  await page.getByRole('button', { name: 'Create', exact: true }).click();

  await expect(page.getByText('Client details', { exact: true })).toBeVisible();

  const clientIdItem = page.getByRole('listitem').filter({
    has: page.getByText('Client id:', { exact: true })
  });
  const credentialsArticle = page.getByRole('article').filter({
    has: page.getByText('Credentials', { exact: true })
  });
  const clientIdText = await clientIdItem.innerText();
  const clientSecretText = await credentialsArticle
    .getByRole('code')
    .innerText();

  return {
    clientId: clientIdText.replace(/^Client id:\s*/, '').trim(),
    clientSecret: clientSecretText.trim()
  };
}

async function enableCommitteeInfo(
  page: Page,
  gammaUrl: string,
  apiKeyId: string
) {
  // Gamma INFO keys expose no group types until explicitly configured.
  await page.goto(`${gammaUrl}/api-keys/${apiKeyId}`);

  // This form has no accessible name. Its endpoint scopes the role locators.
  const infoSettings = page.locator('form[data-hx-post$="/info-settings"]');

  await infoSettings
    .getByRole('button', { name: 'Add type', exact: true })
    .click();
  await infoSettings.getByRole('combobox').selectOption('committee');

  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith('/info-settings') &&
      response.request().method() === 'POST' &&
      response.status() === 200
  );

  await infoSettings.getByRole('button', { name: 'Save', exact: true }).click();
  await saved;
}
