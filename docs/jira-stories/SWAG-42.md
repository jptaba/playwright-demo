# SWAG-42 — Product Inventory Sorting

## User Story

**As a** logged-in shopper,
**I want to** sort the product inventory by name and price,
**So that** I can quickly find the item I want to purchase.

---

## Context

SauceDemo's inventory page (`/inventory.html`) has a sort dropdown in the top-right corner.
It supports four sort options:

| Option label        | Value key |
| ------------------- | --------- |
| Name (A to Z)       | `az`      |
| Name (Z to A)       | `za`      |
| Price (low to high) | `lohi`    |
| Price (high to low) | `hilo`    |

The active sort order is reflected immediately in the product card list — no page reload.

---

## Acceptance Criteria

### AC-1 — Default sort is Name (A to Z)

**Given** a standard user is on the inventory page
**When** the page first loads
**Then** the sort dropdown shows "Name (A to Z)"
**And** the first product card name is alphabetically first among all products

### AC-2 — Sort by Name (Z to A)

**Given** a standard user is on the inventory page
**When** the user selects "Name (Z to A)" from the sort dropdown
**Then** the product list re-orders so the first card name is alphabetically last

### AC-3 — Sort by Price (low to high)

**Given** a standard user is on the inventory page
**When** the user selects "Price (low to high)" from the sort dropdown
**Then** the product list re-orders so the first card price is the lowest available price

### AC-4 — Sort by Price (high to low)

**Given** a standard user is on the inventory page
**When** the user selects "Price (high to low)" from the sort dropdown
**Then** the product list re-orders so the first card price is the highest available price

---

## Out of Scope

- Locked / error users (covered by separate auth stories)
- Persistence of sort preference across sessions
- Filtering by category (not available in SauceDemo)

---

## Notes

- Product card name selector: `[data-test="inventory-item-name"]`
- Product card price selector: `[data-test="inventory-item-price"]`
- Sort dropdown selector: `[data-test="product-sort-container"]`
- All assertions should use the fixture-injected `page` — no direct `page.goto()` needed
