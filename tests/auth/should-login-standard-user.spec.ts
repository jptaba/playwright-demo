// spec: specs/saucedemo-auth.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';
import { users } from '../data/users';
import { LoginPage } from '../pages/login.page';

test.describe('Authentication', () => {
  test('should-login-standard-user @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

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
    await expect(page).toHaveURL(/\/inventory\.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });
});
