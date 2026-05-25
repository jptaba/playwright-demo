// spec: specs/saucedemo-inventory.plan.md
// seed: tests/seed.spec.ts
import { expect, test, urlPatterns } from '../../fixtures';
import { inventorySortOptions } from '../../data/inventory';

test.describe('Inventory Sorting', () => {
  test(
    'should-sort-price-high-to-low @smoke',
    {
      annotation: [
        { type: 'story', description: 'SWAG-42' },
        {
          type: 'ac',
          description: 'AC-4 sort by Price (high to low)',
        },
      ],
    },
    async ({ page, inventoryPage }) => {
      await expect(page).toHaveURL(urlPatterns.inventory);

      await inventoryPage.selectSort(inventorySortOptions.priceHighToLow.value);
      await inventoryPage.assertSelectedSortLabel(
        inventorySortOptions.priceHighToLow.label,
      );

      const prices = await inventoryPage.getProductPrices();
      expect(prices.length).toBeGreaterThan(0);

      const highestPrice = Math.max(...prices);
      expect(prices[0]).toBe(highestPrice);
    },
  );
});
