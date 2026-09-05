import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '*.spec.ts',
  workers: 1,
  retries: 0,
  timeout: 120000,
  globalTimeout: 12 * 60 * 1000,
  expect: { timeout: 20000 },
  outputDir: './test-results',
  use: { trace: 'retain-on-failure' }
});
