import { test as baseTest, expect } from '@playwright/test';
import { frameworkEnv } from './support/env';
import { urlPatterns } from './support/config';
import { LoginPage } from './pages/auth/login.page';
import { CheckoutPage } from './pages/checkout/checkout.page';
import { users } from './data/users';

export { expect };
export { urlPatterns } from './support/config';

export const test = baseTest.extend<{
  loginPage: LoginPage;
  checkoutPage: CheckoutPage;
}>({
  page: async ({ page }, use) => {
    await page.goto(frameworkEnv.baseUrl);
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  // storageState (playwright.config.ts) is the primary auth mechanism: for apps that
  // persist sessions in cookies or localStorage, the page will already be at inventory
  // when the fixture runs and no manual login is needed.
  // SauceDemo uses in-memory React state — storageState cannot restore it — so this
  // fixture falls back to explicit login when the page is not already at inventory.
  checkoutPage: async ({ page }, use) => {
    if (!page.url().includes('/inventory')) {
      const lp = new LoginPage(page);
      await lp.fillCredentials(
        users.standard.username,
        users.standard.password,
      );
      await lp.submit();
      await page.waitForURL(urlPatterns.inventory);
    }
    await use(new CheckoutPage(page));
  },
});
