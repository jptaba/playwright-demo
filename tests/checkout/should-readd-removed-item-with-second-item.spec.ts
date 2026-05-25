// spec: specs/saucedemo-checkout.plan.md
// seed: tests/seed.spec.ts
import { expect, test, urlPatterns } from '../fixtures';
import { checkoutItem, checkoutSecondItem } from '../data/checkout';

test.describe('Checkout', () => {
  test('should-readd-removed-item-with-second-item', async ({
    page,
    checkoutPage,
  }) => {
    // Authenticated via storageState; fixture navigates to baseUrl → inventory.
    await checkoutPage.addItemToCart(checkoutItem);
    await checkoutPage.assertCartBadgeCount(1);

    await checkoutPage.removeItemFromCart(checkoutItem);
    await checkoutPage.assertCartBadgeHidden();

    await checkoutPage.addItemToCart(checkoutSecondItem);
    await checkoutPage.assertCartBadgeCount(1);

    await checkoutPage.addItemToCart(checkoutItem);
    await checkoutPage.assertCartBadgeCount(2);

    await checkoutPage.openCart();
    await expect(page).toHaveURL(urlPatterns.cart);
    await checkoutPage.assertItemVisible(checkoutSecondItem.name);
    await checkoutPage.assertItemVisible(checkoutItem.name);
  });
});
