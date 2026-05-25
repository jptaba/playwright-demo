import { expect, type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  private readonly sortDropdown: Locator;
  private readonly selectedSortOption: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;

  constructor(private readonly page: Page) {
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.selectedSortOption = this.sortDropdown.locator('option:checked');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.itemPrices = page.getByTestId('inventory-item-price');
  }

  async selectSort(value: string): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  async assertSelectedSortLabel(label: string): Promise<void> {
    await expect(this.selectedSortOption).toHaveText(label);
  }

  async getProductNames(): Promise<string[]> {
    const names = await this.itemNames.allTextContents();
    return names.map((name) => name.trim());
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.itemPrices.allTextContents();
    return prices.map((price) => Number(price.replace('$', '').trim()));
  }
}
