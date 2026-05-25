// spec: specs/saucedemo-checkout.plan.md
// seed: tests/seed.spec.ts
import { expect, test, urlPatterns } from '../../fixtures';
import { checkoutCustomer, checkoutItem } from '../../data/checkout';

test.describe('Checkout', () => {
  test('should-complete-checkout-with-single-item @smoke', async ({
    page,
    checkoutPage,
  }) => {
    // Authenticated via storageState; fixture navigates to baseUrl → inventory.
    await checkoutPage.addItemToCart(checkoutItem);
    await checkoutPage.assertCartBadgeCount(1);

    await checkoutPage.openCart();
    await expect(page).toHaveURL(urlPatterns.cart);
    await checkoutPage.assertItemVisible(checkoutItem.name);

    await checkoutPage.startCheckout();
    await expect(page).toHaveURL(urlPatterns.checkoutStepOne);

    await checkoutPage.fillCheckoutInformation(checkoutCustomer);
    await expect(page).toHaveURL(urlPatterns.checkoutStepTwo);
    await checkoutPage.assertItemVisible(checkoutItem.name);

    await checkoutPage.finishCheckout();
    await expect(page).toHaveURL(urlPatterns.checkoutComplete);
    await checkoutPage.assertCheckoutComplete();
  });
});
