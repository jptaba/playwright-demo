# SauceDemo Checkout Test Plan

## Application Overview

SauceDemo is a login-gated storefront where authenticated users can add items to a cart
and complete a checkout flow. This plan covers a successful purchase from a clean seed state.

## Test Scenarios

### 1. Checkout

**Seed:** `tests/seed.spec.ts`

#### 1.1. should-complete-checkout-with-single-item

**File:** `tests/checkout/should-complete-checkout-with-single-item.spec.ts`

**Steps:**

1. Log in as a standard user and add Sauce Labs Backpack to the cart.
   - expect: Cart badge shows 1.

2. Open the cart and start checkout.
   - expect: Cart page shows Sauce Labs Backpack.
   - expect: Checkout information form is visible.

3. Fill the checkout information and continue.
   - expect: Checkout overview shows Sauce Labs Backpack.

4. Finish checkout.
   - expect: Success confirmation shows "Thank you for your order!".

#### 1.2. should-readd-removed-item-with-second-item

**File:** `tests/checkout/should-readd-removed-item-with-second-item.spec.ts`

**Steps:**

1. Log in as a standard user and add Sauce Labs Backpack to the cart.
   - expect: Cart badge shows 1.

2. Remove Sauce Labs Backpack from the cart.
   - expect: Cart badge is hidden.

3. Add Sauce Labs Bike Light to the cart.
   - expect: Cart badge shows 1.

4. Add Sauce Labs Backpack again.
   - expect: Cart badge shows 2.

5. Open the cart.
   - expect: Cart contains Sauce Labs Bike Light.
   - expect: Cart contains Sauce Labs Backpack.
