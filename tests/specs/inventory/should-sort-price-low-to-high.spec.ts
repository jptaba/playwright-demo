// spec: specs/saucedemo-inventory.plan.md
// seed: tests/seed.spec.ts
import { expect, test, urlPatterns } from '../../fixtures';
import { inventorySortOptions } from '../../data/inventory';

test.describe('Inventory Sorting', () => {
  test(
    'should-sort-price-low-to-high @smoke',
    {
      annotation: [
        { type: 'story', description: 'SWAG-42' },
        {
          type: 'ac',
          description: 'AC-3 sort by Price (low to high)',
        },
      ],
    },
    async ({ page, inventoryPage }) => {
      await expect(page).toHaveURL(urlPatterns.inventory);

      await inventoryPage.selectSort(inventorySortOptions.priceLowToHigh.value);
      await inventoryPage.assertSelectedSortLabel(
        inventorySortOptions.priceLowToHigh.label,
      );

      const prices = await inventoryPage.getProductPrices();
      expect(prices.length).toBeGreaterThan(0);

      const lowestPrice = Math.min(...prices);
      expect(prices[0]).toBe(lowestPrice);
    },
  );
});
