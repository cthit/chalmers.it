const path = require('node:path');
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: __dirname,
  testMatch: '*.e2e.js',
  workers: 1,
  retries: 0,
  timeout: 120000,
  expect: { timeout: 20000 },
  outputDir: '../../test-results',
  use: { baseURL: process.env.BASE_URL, trace: 'retain-on-failure' },
  webServer: {
    cwd: path.resolve(__dirname, '../..'),
    command: `node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port ${process.env.TEST_WEBSITE_PORT}`,
    url: `${process.env.BASE_URL}/en/groups`,
    timeout: 180000,
    reuseExistingServer: false
  }
});
