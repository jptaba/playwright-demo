// spec: specs/saucedemo-checkout.plan.md
// seed: tests/seed.spec.ts
import { expect, test } from '../fixtures';
import { users } from '../data/users';
import { checkoutItem, checkoutSecondItem } from '../data/checkout';
import { LoginPage } from '../pages/login.page';
import { CheckoutPage } from '../pages/checkout.page';

test('should-readd-removed-item-with-second-item', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const checkoutPage = new CheckoutPage(page);

  await loginPage.fillCredentials(
    users.standard.username,
    users.standard.password,
  );
  await loginPage.submit();
  await expect(page).toHaveURL(/\/inventory\.html/);

  await checkoutPage.addItemToCart(checkoutItem);
  await checkoutPage.assertCartBadgeCount(1);

  await checkoutPage.removeItemFromCart(checkoutItem);
  await checkoutPage.assertCartBadgeHidden();

  await checkoutPage.addItemToCart(checkoutSecondItem);
  await checkoutPage.assertCartBadgeCount(1);

  await checkoutPage.addItemToCart(checkoutItem);
  await checkoutPage.assertCartBadgeCount(2);

  await checkoutPage.openCart();
  await expect(page).toHaveURL(/\/cart\.html/);
  await checkoutPage.assertItemVisible(checkoutSecondItem.name);
  await checkoutPage.assertItemVisible(checkoutItem.name);
});
