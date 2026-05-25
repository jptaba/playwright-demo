// spec: specs/saucedemo-auth.plan.md
// seed: tests/seed.spec.ts
import { test, expect, urlPatterns } from '../fixtures';
import { users } from '../data/users';

test.describe('Authentication', () => {
  // Clear storageState so this test always exercises the real login flow.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should-login-standard-user @smoke', async ({ page, loginPage }) => {
    // 1. Fill username with standard_user.
    // 2. Fill password with secret_sauce.
    await loginPage.fillCredentials(
      users.standard.username,
      users.standard.password,
    );
    await loginPage.assertCredentialsFilled(
      users.standard.username,
      users.standard.password,
    );

    // 3. Submit the login form.
    await loginPage.submit();
    await expect(page).toHaveURL(urlPatterns.inventory);
    await expect(page.getByText('Products')).toBeVisible();
  });
});
