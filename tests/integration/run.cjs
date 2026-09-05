const { execFileSync, spawnSync } = require('node:child_process');
const { randomUUID } = require('node:crypto');
const path = require('node:path');
const { setTimeout: delay } = require('node:timers/promises');

const root = path.resolve(__dirname, '../..');
const composeArgs = [
  'compose',
  '-p',
  `chalmersit-gamma-test-${randomUUID()}`,
  '-f',
  path.join(__dirname, 'compose.yml')
];
const compose = (...args) =>
  execFileSync('docker', [...composeArgs, ...args], {
    cwd: root,
    encoding: 'utf8',
    timeout: 300000,
    maxBuffer: 10 * 1024 * 1024
  });

async function main() {
  try {
    console.log('Starting isolated Gamma, PostgreSQL and Redis...');
    compose('up', '-d');
    const address = compose('port', 'gamma', '8081').trim();
    const url = `http://${address}`;
    const deadline = Date.now() + 180000;
    let credentials;
    while (Date.now() < deadline) {
      const logs = compose('logs', '--no-color', 'gamma');
      credentials = logs.match(
        /Api key of type INFO has been generated with id: ([\w-]+) and code: (\S+)/
      );
      if (credentials) {
        try {
          const response = await fetch(`${url}/login`, {
            signal: AbortSignal.timeout(2000)
          });
          await response.body?.cancel();
          if (response.ok) break;
        } catch {
          // The bootstrap logs can precede the HTTP listener.
        }
      }
      credentials = undefined;
      await delay(1000);
    }
    if (!credentials) throw new Error('Gamma did not become ready within 180s');

    const databaseAddress = compose('port', 'website-db', '5432').trim();
    const websiteEnv = await require('./setup.cjs')(
      url,
      `postgresql://website_test:website_test@${databaseAddress}/website_test`,
      credentials[1]
    );
    const result = spawnSync(
      process.execPath,
      [
        require.resolve('@playwright/test/cli'),
        'test',
        '--config',
        'tests/integration/playwright.config.cjs'
      ],
      {
        cwd: root,
        stdio: 'inherit',
        timeout: 360000,
        env: {
          ...process.env,
          ...websiteEnv,
          GAMMA_ROOT_URL: url,
          GAMMA_API_KEY_ID: credentials[1],
          GAMMA_API_KEY_TOKEN: credentials[2]
        }
      }
    );
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error('Gamma integration tests failed');
  } catch (error) {
    console.error(compose('logs', '--no-color', '--tail', '100'));
    throw error;
  } finally {
    compose('down', '--volumes', '--remove-orphans');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
