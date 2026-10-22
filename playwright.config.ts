import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  testMatch: '*.spec.ts',
  workers: 1,
  retries: 0,
  timeout: 120000,
  globalTimeout: 20 * 60 * 1000,
  expect: { timeout: 20000 },
  outputDir: './test-results',
  use: {
    browserName: 'chromium',
    actionTimeout: 20000,
    navigationTimeout: 60000,
    viewport: { width: 1440, height: 1000 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  }
});
