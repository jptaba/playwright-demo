# SauceDemo Inventory Sorting Test Plan

## Application Overview

SauceDemo inventory allows authenticated shoppers to sort product cards by name and price. This plan covers default and user-selected sort behavior on the inventory page.

## Test Scenarios

### 1. Inventory Sorting

**Seed:** `tests/seed.spec.ts`

#### 1.1. should-default-to-name-a-to-z

**File:** `tests/specs/inventory/should-default-to-name-a-to-z.spec.ts`

**Steps:**

1. Open the inventory page as a standard user.
   - expect: Sort dropdown shows Name (A to Z).

2. Observe the product list order.
   - expect: First product card name is alphabetically first among all products.

#### 1.2. should-sort-name-z-to-a

**File:** `tests/specs/inventory/should-sort-name-z-to-a.spec.ts`

**Steps:**

1. Open the inventory page as a standard user.
   - expect: Inventory list is visible.

2. Select Name (Z to A) in the sort dropdown.
   - expect: First product card name is alphabetically last among all products.

#### 1.3. should-sort-price-low-to-high

**File:** `tests/specs/inventory/should-sort-price-low-to-high.spec.ts`

**Steps:**

1. Open the inventory page as a standard user.
   - expect: Inventory list is visible.

2. Select Price (low to high) in the sort dropdown.
   - expect: First product card price is the lowest available price.

#### 1.4. should-sort-price-high-to-low

**File:** `tests/specs/inventory/should-sort-price-high-to-low.spec.ts`

**Steps:**

1. Open the inventory page as a standard user.
   - expect: Inventory list is visible.

2. Select Price (high to low) in the sort dropdown.
   - expect: First product card price is the highest available price.
