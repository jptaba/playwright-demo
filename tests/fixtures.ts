import { test as baseTest, expect } from '@playwright/test';
import { frameworkEnv } from './support/env';

export { expect };

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    await page.goto(frameworkEnv.baseUrl);
    await use(page);
  },
});
