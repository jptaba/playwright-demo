---
name: automate-test-case
description: >
  Use when you need a repeatable workflow to automate Playwright test cases.
  Loads project context, detects duplicates and reusable code,
  then executes the official plan → generate → heal cycle.
  Triggers: automate test case, automate these steps, create test for, write test scenario.
---

# Automate Test Case — Full Orchestration Workflow

This skill converts any user-supplied test case (steps, scenarios, or feature description)
into a validated, passing Playwright TypeScript test. It is designed to be **repeatable**:
every test case provided in a single prompt is processed through all phases in sequence.

This file is the authoritative orchestration source for this repository. Prompt files should
delegate here and avoid duplicating full procedural logic.

---

## Phase 0 — Load Project Context (ALWAYS first)

Before touching any test case, read the following files in parallel to build a complete
mental model of the project. This must happen once per session, not once per test case.

```
playwright.config.ts          → baseURL, testIdAttribute, browsers, retries, reporters
tests/fixtures.ts             → fixture design (what state the page is in when tests start)
tests/seed.spec.ts            → seed test entry point
tests/support/env.ts          → environment variables and defaults
tests/data/                   → all existing test data files (users.ts, etc.)
tests/pages/                  → all existing Page Object classes
tests/auth/*.spec.ts          → existing auth tests (and other spec directories)
specs/*.plan.md               → existing plan files
.claude/skills/playwright-cli/references/spec-driven-testing.md  → official workflow rules
```

Key facts to extract and hold for the session:

- `baseUrl` value and how it is overridden
- `testIdAttribute` value (e.g. `data-test` or `data-testid`)
- Fixture navigation pattern (does fixtures.ts already call `page.goto`?)
- List of existing Page Object classes and their public methods/locators
- List of existing test data exports and their shapes
- List of existing spec file names and their `test(...)` descriptions
- List of existing plan files and their covered scenarios

Preflight validation gates (must pass before Phase 1):

1. `.github/skills/automate-test-case/SKILL.md` is present
2. `tests/seed.spec.ts` exists
3. `tests/fixtures.ts` exists
4. Incoming request includes at least one test case

If any gate fails, stop immediately and return:

```
STATUS: INPUT_ERROR
Reason: <clear reason>
Missing: <paths if any>
```

---

## Phase 1 — Parse the Incoming Test Case

Accept test cases in any of these formats:

**Format A — Steps list (most common):**

```
Test Case: Login with locked-out user
Steps:
  1. Navigate to the login page
  2. Enter username "locked_out_user"
  3. Enter password "secret_sauce"
  4. Click Login
  5. Verify error message "Epic sadface: Sorry, this user has been locked out."
```

**Format B — Gherkin / BDD:**

```
Given I am on the login page
When I enter "locked_out_user" and "secret_sauce"
And I click Login
Then I should see "Epic sadface: Sorry, this user has been locked out."
```

**Format C — Plain English:**

```
Test that a locked-out user cannot log in and sees a specific error message.
```

**For each test case, extract:**

1. **Feature area** (e.g. authentication, checkout, product listing)
2. **Scenario name** in kebab-case (e.g. `should-show-error-for-locked-out-user`)
3. **Target URL / page** inferred from steps or baseUrl
4. **Actors / test data** — usernames, passwords, product names, quantities, etc.
5. **Actions** — clicks, fills, navigations, assertions
6. **Expected outcomes** — assertions mapped from "Verify", "Expect", "Then", "Should"

---

## Phase 2 — Duplicate Detection (STOP if duplicate found)

Before generating anything, check for duplicates:

1. **Spec duplicate**: Search `specs/*.plan.md` for a scenario with the same or functionally
   equivalent name and steps. If found, report the path and stop — do not create a second spec.

2. **Test file duplicate**: Search `tests/**/*.spec.ts` for a `test(...)` call whose
   description matches or closely overlaps the new scenario. If found, report the path and stop.

3. **Partial coverage**: If an existing test covers a subset of the new scenario's steps,
   note which steps are already covered. Only create a new test for the uncovered portion,
   and mention that the existing test provides partial coverage.

**Output when duplicate is found:**

```
⚠ DUPLICATE DETECTED
Existing spec:  specs/<existing>.plan.md — scenario "<name>"
Existing test:  tests/<path>/<name>.spec.ts
Action: No new files created. Reuse or extend the existing test.
```

---

## Phase 3 — Reuse Detection (minimize duplication)

If no duplicate, scan for reusable components:

### 3a. Page Objects

For each page/component involved in the test case:

- Check `tests/pages/` for a matching Page Object class
- If found: note the class name and relevant methods/locators to reuse
- If not found: plan to create a new Page Object under `tests/pages/<page-name>.page.ts`

### 3b. Test Data

For each data value (user credentials, product names, etc.):

- Check `tests/data/` for an existing export that matches
- If found: note the import path and export name
- If not found: plan to add the new data to the appropriate file (or create `tests/data/<domain>.ts`)

### 3c. Fixtures

Confirm whether `tests/fixtures.ts` already handles what the test needs at startup.
If the seed navigates to baseUrl automatically, the test body does not need a `page.goto`.

**Reuse report (always emit before proceeding):**

```
REUSE ANALYSIS
✓ Page Object:  tests/pages/login.page.ts → LoginPage (reuse fill(), submit(), login())
✗ Page Object:  tests/pages/product.page.ts → does not exist (will create)
✓ Test Data:    tests/data/users.ts → users.standard (reuse)
✗ Test Data:    users.lockedOut → missing (will add to tests/data/users.ts)
✓ Fixture:      tests/fixtures.ts already navigates to baseUrl
```

---

## Phase 4 — Decision Gate

Based on phases 2 and 3, make one of these decisions and state it explicitly:

| Decision   | Condition                               | Action                                 |
| ---------- | --------------------------------------- | -------------------------------------- |
| **SKIP**   | Exact duplicate found                   | Report and stop                        |
| **EXTEND** | Existing test partially covers scenario | Extend the existing spec and test file |
| **CREATE** | No duplicate, scenario is genuinely new | Proceed to Phase 5                     |

---

## Phase 5 — Create: Plan → Generate → Heal

Only reached when decision is **CREATE** or **EXTEND**.

### 5.1 Write or Update the Spec File

Create `specs/<feature>.plan.md` using the official format from
`.claude/skills/playwright-cli/references/spec-driven-testing.md`.

Each scenario block must include:

- `**Seed:** tests/seed.spec.ts`
- `**File:** tests/<group>/<kebab-case-scenario>.spec.ts`
- Steps at user level with `- expect:` bullets for every assertion

If the plan file for this feature already exists, append the new scenario to it.

### 5.2 Add Missing Test Data

If Phase 3 found missing test data, add it now before generating the test:

- Open `tests/data/<domain>.ts`
- Add the new export or extend the existing object
- Example: add `lockedOut: { username: 'locked_out_user', password: 'secret_sauce' }` to `users`

### 5.3 Create Missing Page Objects

If Phase 3 found a missing Page Object, create `tests/pages/<page-name>.page.ts`:

- Use typed `Locator` properties with `getByTestId()`, `getByRole()`, or `getByLabel()`
- Use the `testIdAttribute` from `playwright.config.ts` (currently `data-test`)
- Expose atomic methods: `fill()`, `submit()`, a combined action method (e.g. `login()`)
- Do not add methods for interactions not needed by the current test case

### 5.4 Generate the Test File

Create `tests/<group>/<kebab-case-scenario>.spec.ts`:

```ts
// spec: specs/<feature>.plan.md
// seed: tests/seed.spec.ts
import { test, expect } from '../fixtures';
import { <PageObject> } from '../pages/<page-name>.page';
import { <data> } from '../data/<domain>';

test('<kebab-case-scenario>', async ({ page }) => {
  const <po> = new <PageObject>(page);
  // Actions and assertions mapped from spec steps
});
```

Rules:

- Import `test` and `expect` from `../fixtures` (not from `@playwright/test` directly)
- One test per file
- Use page object methods, not raw `page.fill()` / `page.click()` calls
- Use test data from `tests/data/` — no hardcoded strings in the test body
- Tag smoke tests with `@smoke` in the test name where appropriate
- No arbitrary `page.waitForTimeout()` — use `expect(...).toBeVisible()` or `toHaveText()`

### 5.5 Start Seed in Debug CLI Mode

```bash
npm run test:seed:debug
# Wait for: "Debugging Instructions" and session name tw-XXXX
```

### 5.6 Attach and Explore via playwright-cli

```bash
npx playwright-cli attach tw-XXXX
playwright-cli resume
playwright-cli snapshot   # verify current page state matches seed
```

Navigate through the test scenario interactively to:

- Confirm locators match actual DOM (`getByTestId`, `getByRole`, etc.)
- Observe exact error messages or text for assertions
- Correct any selector mismatches before running the full test

Stop the background test when done:

```bash
playwright-cli close
```

### 5.7 Run the Test

```bash
npm run test:e2e -- tests/<group>/<kebab-case-scenario>.spec.ts
```

---

## Phase 6 — Validate and Heal

### 6.1 Evaluate Results

- **All tests pass** → emit success summary (Phase 7)
- **Test fails** → proceed to heal loop (Phase 6.2)
- **TypeScript errors** → fix type errors first, then re-run

### 6.2 Heal Loop (max 3 iterations)

For each failing test:

1. Read the error message and stack trace
2. Attach to a new debug CLI session:
   ```bash
   npm run test:seed:debug
   npx playwright-cli attach tw-XXXX
   ```
3. Navigate to the failing action and inspect the element:
   ```bash
   playwright-cli snapshot
   playwright-cli eval "el => el.getAttribute('data-test')" e5
   ```
4. Fix the test file (selector, assertion text, timing)
5. Re-run the test
6. If still failing after 3 iterations: document the blocker and stop

### 6.3 Reconcile the Spec

After healing, update `specs/<feature>.plan.md` if any steps or expected outcomes
changed during diagnosis (e.g. actual error text differed from what was specified).

### 6.4 Run TypeScript Typecheck

```bash
npm run typecheck
```

Fix all TypeScript errors before marking a test case complete.

---

## Phase 7 — Success Summary

For each test case processed, emit:

```
TEST CASE: <scenario-name>
Decision: SKIP | EXTEND | CREATE
Spec: <path>
Test: <path or N/A>
Page Objects: <created/reused list>
Test Data: <created/updated/reused list>
Run Status: PASSED | FAILED | HEALED
Heal Iterations: <0-3>
Typecheck: PASS | FAIL
Notes: <duplicates, blockers, or reconciliation updates>
```

After all test cases, emit:

```
SUMMARY
Total Cases: <n>
Created: <n>
Extended: <n>
Skipped: <n>
Failed: <n>
```

---

## Phase 8 — Repeat for Next Test Case

After Phase 7, return to **Phase 1** with the next test case from the user's input.
Do not reload project context (Phase 0) — it is shared for the entire session.
Process all test cases before returning a final summary.

---

## Rules and Constraints

- **One test per `.spec.ts` file** — never combine multiple scenarios in one file
- **Never use `page.waitForTimeout()`** — use web-first assertions instead
- **Never hardcode test data in spec files** — always use `tests/data/`
- **Always import from `../fixtures`** — not from `@playwright/test` directly
- **Always run `npm run typecheck` after generating or editing any `.ts` file**
- **Never create a Page Object method that isn't needed by the current test case**
- **Prefer `getByTestId()` with `data-test` attribute** per `playwright.config.ts`
- **Selector fallback order**: `getByTestId` → `getByRole` → `getByLabel` → `getByText` → CSS
- **Never skip Phase 2 (duplicate check)** — always check before creating files

---

## Project Layout Reference

```
playwright.config.ts          Configuration (baseURL, browsers, retries, reporters)
tsconfig.json                 TypeScript strict mode, Node16 module resolution
package.json                  Scripts: typecheck, test:e2e, test:seed:debug, cli

tests/
  fixtures.ts                 Extended test fixture (navigates to baseUrl)
  seed.spec.ts                Seed test for playwright-cli attach workflow
  support/
    env.ts                    Environment config (BASE_URL)
  data/
    users.ts                  Centralized test data (users.standard, etc.)
  pages/
    login.page.ts             LoginPage page object
  auth/
    should-login-standard-user.spec.ts   Example auth test

specs/
  saucedemo-auth.plan.md      Example plan file (official format)

.claude/skills/playwright-cli/
  SKILL.md                    Official Playwright CLI skill
  references/
    spec-driven-testing.md    Official plan→generate→heal workflow
    test-generation.md        Code generation mechanics
    healing.md                Heal loop details

.github/
  copilot-instructions.md     Always-on agent instructions
  skills/
    playwright-test-agent/SKILL.md        Playwright CLI skill wrapper
    automate-test-case/SKILL.md           THIS FILE — full orchestration
  prompts/
    automate-test-cases.prompt.md         User-facing prompt entry point
    generate-playwright-test.prompt.md    Single spec generation prompt
```
