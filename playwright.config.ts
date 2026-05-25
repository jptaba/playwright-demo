import { defineConfig, devices } from '@playwright/test';
import { config as loadEnv } from 'dotenv';
import { authStorageState } from './tests/support/config';

loadEnv({ quiet: true });

const baseURL = process.env.BASE_URL ?? 'https://www.saucedemo.com';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: true,
  timeout: 90_000,
  expect: {
    timeout: 10_000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? '50%' : undefined,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'artifacts/html-report', open: 'never' }],
    ['junit', { outputFile: 'artifacts/reports/junit.xml' }],
    ['json', { outputFile: 'artifacts/reports/results.json' }],
  ],
  outputDir: 'artifacts/test-results',
  use: {
    baseURL,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    // Auth state generation — logs in once, writes storageState to artifacts/auth/.
    // Browser projects depend on this so the state file is ready before any spec runs.
    // For apps that persist auth in cookies or localStorage, storageState fully handles
    // authentication and no manual login is needed in specs.
    // SauceDemo uses in-memory React state (no persistent storage), so the
    // checkoutPage fixture falls back to explicit login when storageState has no effect.
    {
      name: 'setup',
      testMatch: 'tests/setup/global.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: authStorageState },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: authStorageState },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: authStorageState },
      dependencies: ['setup'],
    },
  ],
});
