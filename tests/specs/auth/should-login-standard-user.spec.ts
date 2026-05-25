// spec: specs/saucedemo-auth.plan.md
// seed: tests/seed.spec.ts
import { test, expect, urlPatterns } from '../../fixtures';
import { users } from '../../data/users';

test.describe('Authentication', () => {
  // Clear storageState so this test always exercises the real login flow.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should-login-standard-user @smoke', async ({ page, loginPage }) => {
    // 1. Fill credentials and submit.
    await loginPage.fillCredentials(
      users.standard.username,
      users.standard.password,
    );
    await loginPage.submit();

    // 2. Assert successful login: inventory URL and Products heading visible.
    await expect(page).toHaveURL(urlPatterns.inventory);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
});
