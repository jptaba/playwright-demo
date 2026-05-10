// spec: specs/saucedemo-checkout.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../fixtures';
import { users } from '../data/users';
import { checkoutCustomer, checkoutItem } from '../data/checkout';
import { LoginPage } from '../pages/login.page';
import { CheckoutPage } from '../pages/checkout.page';

test.describe('Checkout', () => {
  test('should-complete-checkout-with-single-item @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.fillCredentials(
      users.standard.username,
      users.standard.password,
    );
    await loginPage.submit();
    await expect(page).toHaveURL(/\/inventory\.html/);

    await checkoutPage.addItemToCart(checkoutItem);
    await expect(page.getByText('1', { exact: true })).toBeVisible();

    await checkoutPage.openCart();
    await expect(page).toHaveURL(/\/cart\.html/);
    await checkoutPage.assertItemVisible(checkoutItem.name);

    await checkoutPage.startCheckout();
    await expect(page).toHaveURL(/\/checkout-step-one\.html/);

    await checkoutPage.fillCheckoutInformation(checkoutCustomer);
    await expect(page).toHaveURL(/\/checkout-step-two\.html/);
    await checkoutPage.assertItemVisible(checkoutItem.name);

    await checkoutPage.finishCheckout();
    await checkoutPage.assertCheckoutComplete();
  });
});
