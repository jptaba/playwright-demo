/**
 * Framework-level constants shared across playwright.config.ts and test files.
 * Import URL patterns and the auth state path from here to keep all
 * project-wide values in a single maintainable location.
 */

/** Path where global setup writes authenticated browser state. */
export const authStorageState = 'artifacts/auth/standard-user.json' as const;

/**
 * Regex URL patterns for page-level navigation assertions.
 * Use these instead of raw inline regex literals in spec files.
 *
 * @example
 * await expect(page).toHaveURL(urlPatterns.inventory);
 */
export const urlPatterns = {
  inventory: /\/inventory\.html/,
  cart: /\/cart\.html/,
  checkoutStepOne: /\/checkout-step-one\.html/,
  checkoutStepTwo: /\/checkout-step-two\.html/,
  checkoutComplete: /\/checkout-complete\.html/,
} as const;
