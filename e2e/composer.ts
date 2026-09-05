import {
  test as base,
  expect,
  type Browser,
  type Page
} from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import {
  GenericContainer,
  Network,
  Wait,
  type StartedTestContainer
} from 'testcontainers';
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { startWebhookReceiver, type WebhookReceiver } from './helpers/webhook';
import { createServer, type AddressInfo } from 'node:net';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = path.resolve(__dirname, '..');
const gammaImage =
  'ghcr.io/cthit/gamma:2.5.1@sha256:5112c5673ee5c98b072c38afe4ed0de5f7f7d6ae85c41bbd318c92f0e3d5d9db';
// Data is loaded by Gamma's real bootstrap, not an HTTP mock.
const gammaSeed = {
  users: [
    {
      id: '88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f',
      cid: 'mscott',
      nick: 'Gamma Smoke Member',
      firstName: 'Michael',
      lastName: 'Scott',
      acceptanceYear: 2005
    }
  ],
  superGroups: [
    {
      id: 'aed27030-ad90-4526-855c-1e909b1dcecb',
      name: 'digit',
      prettyName: 'digIT',
      type: 'COMMITTEE'
    }
  ],
  groups: [
    {
      id: 'acd27030-ad90-4526-855c-1e909b1dcecb',
      name: 'digit-test',
      prettyName: 'digIT test',
      superGroupId: 'aed27030-ad90-4526-855c-1e909b1dcecb',
      members: [
        {
          userId: '88eec5c2-5ebb-4e13-9a76-fcc4dac9e74f',
          postId: '7bb1db15-730d-4864-bfc3-99abe7c0ccf8'
        }
      ]
    }
  ],
  posts: [
    {
      id: '7bb1db15-730d-4864-bfc3-99abe7c0ccf8',
      postName: { sv: 'Testordförande', en: 'Gamma Smoke Chair' }
    }
  ]
};

export type Environment = {
  websiteUrl: string;
  gammaUrl: string;
  db: PrismaClient;
  webhook: WebhookReceiver;
  logs: () => { gamma: string; website: string };
};

export const test = base.extend<
  { environment: Environment },
  { stack: Environment }
>({
  environment: async ({ stack }, use, testInfo) => {
    // Each test gets fresh content and a fresh browser context; Gamma is shared.
    await stack.db.eventNotifiers.deleteMany();
    await stack.db.newsPost.deleteMany();
    await stack.db.divisionPage.deleteMany();
    await stack.db.media.deleteMany();
    stack.webhook.reset();
    try {
      await use(stack);
    } finally {
      if (testInfo.status !== testInfo.expectedStatus) {
        for (const [name, body] of Object.entries(stack.logs())) {
          await testInfo.attach(`${name}.log`, {
            body,
            contentType: 'text/plain'
          });
        }
        await testInfo.attach('webhooks.json', {
          body: JSON.stringify(stack.webhook.requests, null, 2),
          contentType: 'application/json'
        });
      }
    }
  },
  stack: [
    async ({ browser }, use, workerInfo) => {
      const network = new Network();
      let startedNetwork: Awaited<ReturnType<Network['start']>> | undefined;
      const mediaPath = await mkdtemp(
        path.join(tmpdir(), 'chalmersit-e2e-media-')
      );
      let webhook: WebhookReceiver | undefined;
      let db: PrismaClient | undefined;
      const containers: StartedTestContainer[] = [];
      let website: ChildProcess | undefined;
      let gammaLogs = '';
      let websiteLogs = '';
      const track = async <T extends StartedTestContainer>(
        pending: Promise<T>
      ): Promise<T> => {
        const container = await pending;
        containers.push(container);
        return container;
      };
      try {
        startedNetwork = await network.start();
        webhook = await startWebhookReceiver();
        console.log(
          'Starting Gamma, PostgreSQL and Redis with Testcontainers...'
        );
        const gammaDb = await track(
          new PostgreSqlContainer('postgres:16.0-alpine')
            .withNetwork(startedNetwork)
            .withNetworkAliases('gamma-db')
            .withDatabase('gamma_test')
            .withUsername('gamma_test')
            .withPassword('gamma_test')
            .start()
        );
        await track(
          new GenericContainer('redis:5.0.14-alpine')
            .withNetwork(startedNetwork)
            .withNetworkAliases('redis')
            .withWaitStrategy(Wait.forLogMessage('Ready to accept connections'))
            .start()
        );
        const websiteDb = await track(
          new PostgreSqlContainer('postgres:16.0-alpine')
            .withDatabase('website_test')
            .withUsername('website_test')
            .withPassword('website_test')
            .start()
        );
        const gamma = await track(
          new GenericContainer(gammaImage)
            .withPlatform('linux/amd64')
            .withNetwork(startedNetwork)
            .withEnvironment({
              DB_HOST: 'gamma-db',
              DB_NAME: gammaDb.getDatabase(),
              DB_USER: gammaDb.getUsername(),
              DB_PASSWORD: gammaDb.getPassword(),
              REDIS_HOST: 'redis',
              SERVER_PORT: '8081',
              BASE_URL: 'http://localhost:8081',
              PRODUCTION: 'false',
              IS_MOCKING: 'true',
              ADMIN_SETUP: 'true',
              MOCK_DATA_RESOURCE: 'file:/tmp/gamma-seed.json',
              UPLOAD_FOLDER: '/tmp/uploads/'
            })
            .withCopyContentToContainer([
              {
                content: JSON.stringify(gammaSeed),
                target: '/tmp/gamma-seed.json'
              }
            ])
            .withExposedPorts(8081)
            .withLogConsumer((stream) =>
              stream.on('data', (chunk) => {
                gammaLogs = (gammaLogs + chunk.toString()).slice(-100000);
              })
            )
            .withWaitStrategy(
              Wait.forAll([
                Wait.forLogMessage(/Api key of type INFO has been generated/),
                Wait.forHttp('/login', 8081).forStatusCode(200)
              ])
            )
            .withStartupTimeout(180000)
            .start()
        );
        const gammaUrl = `http://${gamma.getHost()}:${gamma.getMappedPort(8081)}`;
        const credentialPattern =
          /Api key of type INFO has been generated with id: ([\w-]+) and code: ([A-Za-z0-9]+)/;
        // The wait strategy and log consumer use separate streams. Wait until
        // the consumer has received the credentials before reading them.
        await expect
          .poll(() => gammaLogs, { timeout: 30000 })
          .toMatch(credentialPattern);
        const credentials = gammaLogs.match(credentialPattern);
        if (!credentials)
          throw new Error('Gamma did not emit its bootstrap INFO credentials');
        const env = await configureWebsite(
          browser,
          gammaUrl,
          websiteDb.getConnectionUri(),
          credentials[1]
        );
        db = new PrismaClient({
          adapter: new PrismaPg({ connectionString: env.DATABASE_URL })
        });
        website = spawn(
          process.execPath,
          [
            require.resolve('next/dist/bin/next'),
            'dev',
            '--hostname',
            '127.0.0.1',
            '--port',
            env.TEST_WEBSITE_PORT
          ],
          {
            cwd: root,
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: {
              ...process.env,
              ...env,
              NODE_ENV: 'development',
              MEDIA_PATH: mediaPath,
              ACTIVE_GROUP_TYPES: 'committee',
              ADMIN_GROUPS: 'digit',
              PAGE_EDITOR_GROUPS: 'digit',
              NEXT_TELEMETRY_DISABLED: '1',
              GAMMA_API_KEY_ID: credentials[1],
              GAMMA_API_KEY_TOKEN: credentials[2]
            }
          }
        );
        let startupError: Error | undefined;
        website.on('error', (error) => {
          startupError = error;
        });
        const collect = (chunk: Buffer) => {
          websiteLogs = (websiteLogs + chunk.toString()).slice(-100000);
        };
        website.stdout?.on('data', collect);
        website.stderr?.on('data', collect);
        await expect
          .poll(
            async () => {
              if (startupError) throw startupError;
              const response = await fetch(`${env.BASE_URL}/en/groups`, {
                signal: AbortSignal.timeout(2000)
              }).catch(() => undefined);
              await response?.body?.cancel();
              return response?.status;
            },
            { timeout: 180000, intervals: [500, 1000] }
          )
          .toBe(200);
        await use({
          websiteUrl: env.BASE_URL,
          gammaUrl,
          db,
          webhook,
          logs: () => ({ gamma: gammaLogs, website: websiteLogs })
        });
      } catch (error) {
        const logPath = path.join(
          workerInfo.project.outputDir,
          `startup-${workerInfo.workerIndex}.log`
        );
        await writeFile(
          logPath,
          `Gamma:
${gammaLogs}
Website:
${websiteLogs}`
        ).catch(() => {});
        console.error(`E2E environment failed. Logs: ${logPath}
${websiteLogs.slice(-8000)}`);
        throw error;
      } finally {
        // Always attempt every cleanup, including when a startup step failed.
        const stopped = await Promise.allSettled([
          stopWebsite(website),
          db?.$disconnect(),
          webhook?.close()
        ]);
        const containersStopped = await Promise.allSettled(
          containers.reverse().map((container) => container.stop())
        );
        const rest = await Promise.allSettled([
          startedNetwork?.stop(),
          rm(mediaPath, { recursive: true, force: true })
        ]);
        const failure = [...stopped, ...containersStopped, ...rest].find(
          (result) => result.status === 'rejected'
        );
        if (failure?.status === 'rejected') throw failure.reason;
      }
    },
    { scope: 'worker', timeout: 480000 }
  ],
  baseURL: async ({ environment }, use) => {
    await use(environment.websiteUrl);
  }
});

async function stopWebsite(website?: ChildProcess) {
  if (!website?.pid || website.exitCode !== null || website.signalCode !== null)
    return;
  const exited = once(website, 'exit');
  // Next spawns a server child; stop the process group as well as the CLI.
  process.kill(-website.pid, 'SIGTERM');
  await Promise.race([exited, delay(10000)]);
  if (website.exitCode === null && website.signalCode === null) {
    process.kill(-website.pid, 'SIGKILL');
    await exited;
  }
}

async function configureWebsite(
  browser: Browser,
  gammaUrl: string,
  databaseUrl: string,
  apiKeyId: string
) {
  const port = await new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as AddressInfo).port;
      server.close(() => resolve(port));
    });
  });
  const websiteUrl = `http://localhost:${port}`;
  const context = await browser.newContext();
  let page: Page | undefined;
  let clientId;
  let clientSecret;
  try {
    // Provision the official OAuth client through Gamma itself in a separate session.
    page = await context.newPage();
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
    await context.close();
  }
  execFileSync(
    process.execPath,
    [require.resolve('prisma/build/index.js'), 'db', 'push'],
    {
      env: { ...process.env, DATABASE_URL: databaseUrl },
      stdio: 'inherit'
    }
  );
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl })
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
}
