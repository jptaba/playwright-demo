# Test Generation Reference

Rules and patterns for generating Playwright TypeScript test files in this repository.

---

## File placement

| What           | Where                                                        |
| -------------- | ------------------------------------------------------------ |
| Spec file      | `tests/<group>/<scenario-name>.spec.ts`                      |
| Page object    | `tests/pages/<domain>/<page-name>.page.ts`                   |
| Test data      | `tests/data/<domain>.ts`                                     |
| Helper utility | `tests/helpers/index.ts`                                     |
| URL patterns   | `tests/support/config.ts` → `urlPatterns`                    |
| Auth state     | `tests/setup/global.setup.ts` writes `artifacts/auth/*.json` |
| Fixtures       | `tests/fixtures.ts` (do not modify unless explicitly asked)  |

`<group>` and `<domain>` must match the feature group from the plan (e.g. `auth`, `checkout`, `cart`).

Page objects MUST be organized by domain — never place new page objects at the flat `tests/pages/` root.

---

## Spec file template

```ts
// spec: specs/<feature>.plan.md
// seed: tests/seed.spec.ts
import { test, expect, urlPatterns } from '../fixtures';
import { <data> } from '../data/<domain>';

test.describe('<FeatureGroup>', () => {
  test('<scenario-name> @smoke', {
    annotation: [
      { type: 'story', description: '<JIRA-KEY>' },
      { type: 'ac', description: '<acceptance-criteria-summary>' },
    ],
  }, async ({ page, <pageObjectFixture> }) => {
    // Page objects are injected via fixtures — never instantiate with new XPage(page).
    // step comments map 1:1 to plan steps.
    // Use urlPatterns.xxx instead of raw inline regex for URL assertions.
    await expect(page).toHaveURL(urlPatterns.inventory);
  });
});
```

Omit the `annotation` block only when no Jira story ID was supplied.

All spec files MUST use `test.describe(...)`. It is required for proper test organisation at scale.

Available injected fixtures (declared in `tests/fixtures.ts`):

- `loginPage` — `LoginPage` instance
- `checkoutPage` — `CheckoutPage` instance

For auth tests that test the login flow, add `test.use({ storageState: { cookies: [], origins: [] } })` inside the describe block to bypass cached auth state.

Tag tests with `@smoke` when they cover the critical happy path.

---

## Import rules

| Item             | Import from                                                |
| ---------------- | ---------------------------------------------------------- |
| `test`, `expect` | `'../fixtures'` — never from `'@playwright/test'` directly |
| Page objects     | `'../pages/<domain>/<name>.page'`                          |
| Test data        | `'../data/<domain>'`                                       |

---

## Page object template

```ts
import { expect, type Locator, type Page } from '@playwright/test';

export class <PageName>Page {
  private readonly <locatorName>: Locator;

  constructor(private readonly page: Page) {
    this.<locatorName> = page.getByTestId('<data-test-value>');
  }

  async <action>(): Promise<void> {
    await this.<locatorName>.click();
  }

  async assert<State>(): Promise<void> {
    await expect(this.<locatorName>).toBeVisible();
  }
}
```

Rules:

- All locator properties are `private readonly`
- Constructor receives `private readonly page: Page`
- Methods return `Promise<void>` unless they return a value
- Locator selection order: `getByTestId` → `getByRole` → `getByLabel` → `getByText` → CSS
- Only add methods actually used by the current test case
- Group action methods first, assertion methods last

---

## Test data rules

- All data lives under `tests/data/`
- Export named `const` objects — never default exports
- Shape example for users:
  ```ts
  export const users = {
    standard: { username: 'standard_user', password: 'secret_sauce' },
  } as const;
  ```
- Use `as const` for all data objects to get literal types
- Never hardcode data inside spec files — always import

---

## Timing rules

| Forbidden                 | Use instead                               |
| ------------------------- | ----------------------------------------- |
| `page.waitForTimeout(N)`  | `await expect(locator).toBeVisible()`     |
| `page.waitForTimeout(N)`  | `await expect(page).toHaveURL(/pattern/)` |
| `sleep` / `delay` helpers | web-first `expect` assertions             |

---

## Assertion patterns

```ts
// URL check
await expect(page).toHaveURL(/\/inventory\.html/);

// Visibility
await expect(locator).toBeVisible();

// Exact text
await expect(locator).toHaveText('Thank you for your order!');

// Partial text
await expect(locator).toContainText('dispatched');

// Input value
await expect(input).toHaveValue('standard_user');

// Element count
await expect(locator).toHaveCount(0); // hidden / absent
await expect(locator).toHaveText('2'); // badge count as string
```

---

## One test per file rule

Each `spec.ts` file contains exactly one `test(...)` call (or one `test.describe` block with one `test`).
Multiple scenarios from the same plan go into separate files.

---

## Typecheck gate

After generating or editing any `.ts` file, run:

```bash
npm run typecheck
```

Fix all TypeScript errors before marking the task complete. Common errors:

| Error                                    | Fix                                                       |
| ---------------------------------------- | --------------------------------------------------------- |
| `Object is possibly undefined`           | Use `!` assertion or null-check only at system boundaries |
| `Property does not exist`                | Add the locator/method to the page object                 |
| `Argument of type 'X' is not assignable` | Check data types match the method signature               |
