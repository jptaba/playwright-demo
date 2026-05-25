import { expect, type Locator, type Page } from '@playwright/test';
import type { CheckoutCustomer, CheckoutItem } from '../../data/checkout';

export class CheckoutPage {
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;
  private readonly checkoutButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly finishButton: Locator;
  private readonly completeHeader: Locator;
  private readonly completeText: Locator;

  constructor(private readonly page: Page) {
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.checkoutButton = page.getByTestId('checkout');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.completeHeader = page.getByTestId('complete-header');
    this.completeText = page.getByTestId('complete-text');
  }

  async addItemToCart(item: CheckoutItem): Promise<void> {
    await this.page.getByTestId(`add-to-cart-${item.slug}`).click();
  }

  async removeItemFromCart(item: CheckoutItem): Promise<void> {
    await this.page.getByTestId(`remove-${item.slug}`).click();
  }

  async assertCartBadgeCount(count: number): Promise<void> {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async assertCartBadgeHidden(): Promise<void> {
    await expect(this.cartBadge).toHaveCount(0);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async fillCheckoutInformation(customer: CheckoutCustomer): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
    await this.continueButton.click();
  }

  async assertItemVisible(itemName: string): Promise<void> {
    await expect(this.page.getByText(itemName, { exact: true })).toBeVisible();
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async assertCheckoutComplete(): Promise<void> {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
    await expect(this.completeText).toContainText(
      'Your order has been dispatched',
    );
  }
}
