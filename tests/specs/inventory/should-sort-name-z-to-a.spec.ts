// spec: specs/saucedemo-inventory.plan.md
// seed: tests/seed.spec.ts
import { expect, test, urlPatterns } from '../../fixtures';
import { inventorySortOptions } from '../../data/inventory';

test.describe('Inventory Sorting', () => {
  test(
    'should-sort-name-z-to-a @smoke',
    {
      annotation: [
        { type: 'story', description: 'SWAG-42' },
        {
          type: 'ac',
          description: 'AC-2 sort by Name (Z to A)',
        },
      ],
    },
    async ({ page, inventoryPage }) => {
      await expect(page).toHaveURL(urlPatterns.inventory);

      await inventoryPage.selectSort(inventorySortOptions.nameDesc.value);
      await inventoryPage.assertSelectedSortLabel(
        inventorySortOptions.nameDesc.label,
      );

      const names = await inventoryPage.getProductNames();
      expect(names.length).toBeGreaterThan(0);

      const sortedDescending = [...names].sort((left, right) =>
        right.localeCompare(left),
      );
      expect(names[0]).toBe(sortedDescending[0]);
    },
  );
});
