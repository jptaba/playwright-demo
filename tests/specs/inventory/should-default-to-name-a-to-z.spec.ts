// spec: specs/saucedemo-inventory.plan.md
// seed: tests/seed.spec.ts
import { expect, test, urlPatterns } from '../../fixtures';
import { inventorySortOptions } from '../../data/inventory';

test.describe('Inventory Sorting', () => {
  test(
    'should-default-to-name-a-to-z @smoke',
    {
      annotation: [
        { type: 'story', description: 'SWAG-42' },
        {
          type: 'ac',
          description: 'AC-1 default sort is Name (A to Z)',
        },
      ],
    },
    async ({ page, inventoryPage }) => {
      await expect(page).toHaveURL(urlPatterns.inventory);
      await inventoryPage.assertSelectedSortLabel(
        inventorySortOptions.nameAsc.label,
      );

      const names = await inventoryPage.getProductNames();
      expect(names.length).toBeGreaterThan(0);

      const sortedAscending = [...names].sort((left, right) =>
        left.localeCompare(right),
      );
      expect(names[0]).toBe(sortedAscending[0]);
    },
  );
});
