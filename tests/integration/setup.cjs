const { chromium, expect } = require('@playwright/test');
const { PrismaClient } = require('@prisma/client');
const { createServer } = require('node:net');
const { execFileSync } = require('node:child_process');

module.exports = async function setup(gammaUrl, databaseUrl, apiKeyId) {
  const port = await new Promise((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
  const websiteUrl = `http://localhost:${port}`;
  const browser = await chromium.launch();
  let page;
  let clientId;
  let clientSecret;
  try {
    // Provision the official OAuth client through Gamma itself in a separate session.
    page = await browser.newPage();
    page.setDefaultTimeout(20000);
    await page.goto(`${gammaUrl}/login`);
    await page.locator('[name="username"]').fill('admin');
    await page.locator('[name="password"]').fill('password1337');
    await page.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(page.getByText('Hey, admin!')).toBeVisible();
    await page.goto(`${gammaUrl}/clients/create`);
    await page.locator('[name="prettyName"]').fill('Website smoke test');
    await page
      .locator('[name="svDescription"]')
      .fill('Lokalt integrationstest');
    await page.locator('[name="enDescription"]').fill('Local integration test');
    await page
      .locator('[name="redirectUrl"]')
      .fill(`${websiteUrl}/api/auth/callback/gamma`);
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByText('Client details', { exact: true })).toBeVisible(
      { timeout: 20000 }
    );
    clientId = (
      await page.locator('li:has-text("Client id:") span').first().innerText()
    ).trim();
    clientSecret = (
      await page
        .locator('article:has-text("Credentials") code')
        .first()
        .innerText()
    ).trim();
    // Gamma INFO keys expose no group types until explicitly configured.
    await page.goto(`${gammaUrl}/api-keys/${apiKeyId}`);
    const infoSettings = page.locator('form[data-hx-post$="/info-settings"]');
    await infoSettings
      .getByRole('button', { name: 'Add type', exact: true })
      .click();
    await infoSettings.locator('select').selectOption('committee');
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().endsWith('/info-settings') &&
          response.request().method() === 'POST' &&
          response.status() === 200
      ),
      infoSettings.getByRole('button', { name: 'Save', exact: true }).click()
    ]);
  } catch (error) {
    console.error(
      'Gamma client setup page:',
      await page?.locator('body').innerText()
    );
    throw error;
  } finally {
    await browser.close();
  }
  execFileSync(
    process.execPath,
    [require.resolve('prisma'), 'db', 'push', '--skip-generate'],
    {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'inherit'
    }
  );
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } }
  });
  try {
    // Website stores only its group mapping; member name and post live exclusively in Gamma.
    await prisma.divisionGroup.create({
      data: {
        gammaSuperGroupId: 'aed27030-ad90-4526-855c-1e909b1dcecb',
        slug: 'digit',
        prettyName: 'digIT',
        descriptionEn: '',
        descriptionSv: '',
        type: { create: { nameEn: 'Committees', nameSv: 'Kommittéer' } }
      }
    });
  } finally {
    await prisma.$disconnect();
  }
  return {
    DATABASE_URL: databaseUrl,
    GAMMA_ROOT_URL: gammaUrl,
    GAMMA_CLIENT_ID: clientId,
    GAMMA_CLIENT_SECRET: clientSecret,
    NEXTAUTH_SECRET: 'isolated-browser-test-only',
    NEXTAUTH_URL: `${websiteUrl}/api/auth`,
    BASE_URL: websiteUrl,
    TEST_WEBSITE_PORT: String(port),
    TZ: 'UTC'
  };
};
