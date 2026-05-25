---
name: automate-test-case
description: >
  Use when you need a repeatable workflow to automate Playwright test cases.
  Loads project context, detects duplicates and reusable code,
  then executes the repository plan -> generate -> run -> heal cycle using
  Playwright MCP for live exploration. No CLI agents required.
  Triggers: automate test case, automate these steps, create test for, write test scenario.
---

# Automate Test Case — Full MCP-Native Orchestration Workflow

This skill converts user-supplied test cases into validated Playwright TypeScript tests
using only `@playwright/test`, `@playwright/mcp`, and VS Code Copilot Agent tools.
No Playwright CLI agent installation is required or expected.

This file is the **authoritative orchestration source** for this repository.
All prompts and instructions defer to this skill for phase order, decision gates,
healing behaviour, and constraints.

Reference files in the same folder:

- `references/plan-format.md` — exact format for `specs/*.plan.md` files
- `references/mcp-exploration.md` — how to use Playwright MCP for live DOM exploration
- `references/test-generation.md` — code generation patterns and rules
- `references/healing.md` — heal loop step-by-step guide

---

## Phase 0 — Load Project Context (always first)

Read these files once per session before doing anything else:

```
playwright.config.ts
tests/fixtures.ts
tests/seed.spec.ts
tests/support/env.ts
tests/data/**
tests/pages/**
tests/**/*.spec.ts
specs/*.plan.md
```

Capture these facts and hold them for later phases:

| Fact                                         | Where                                                                     |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| `baseUrl`                                    | `tests/support/env.ts` and `playwright.config.ts`                         |
| `testIdAttribute`                            | `playwright.config.ts` → `use.testIdAttribute` (`data-test`)              |
| Fixture auto-navigation                      | `tests/fixtures.ts` → `page.goto(frameworkEnv.baseUrl)` before every test |
| Test timeout                                 | `playwright.config.ts` → `timeout: 90_000`                                |
| Existing page objects + their public methods | `tests/pages/*.page.ts`                                                   |
| Existing test data exports                   | `tests/data/*.ts`                                                         |
| Existing scenario names                      | `specs/*.plan.md` and `tests/**/*.spec.ts`                                |

**Preflight gates — all must pass before proceeding:**

1. `.github/skills/automate-test-case/SKILL.md` is readable
2. `tests/seed.spec.ts` exists
3. `tests/fixtures.ts` exists
4. At least one test case is provided by the user

On gate failure, stop immediately:

```
STATUS: INPUT_ERROR
Reason: <exact reason>
Missing: <file paths if applicable>
```

---

## Phase 1 — Parse Input Test Cases

Accepted input formats:

- Step list (numbered or bulleted)
- Gherkin / BDD (`Given / When / Then`)
- Plain English scenario description

For each test case, extract and record:

1. **Feature area** — the functional domain (auth, checkout, cart, etc.)
2. **Scenario name** — kebab-case, concise, describing the outcome
   - Examples: `should-login-standard-user`, `should-complete-checkout-with-single-item`
3. **Target starting URL** — most cases start at `baseUrl` via the fixture
4. **Test data entities** — users, products, form values, etc.
5. **Actions** — ordered list of user interactions
6. **Expected outcomes** — observable assertions after each action

If an input is ambiguous, infer the most likely intent from the existing codebase patterns
and proceed. Do not stop to ask unless the ambiguity would cause incompatible file paths.

---

## Phase 2 — Duplicate Detection

Before writing any file:

1. Search `specs/*.plan.md` for scenario headings matching the parsed name or its synonyms
2. Search `tests/**/*.spec.ts` for `test(` or `test.describe(` names matching the scenario
3. Detect partial overlaps — identify which steps are already covered

**Exact duplicate found:**

```
DUPLICATE DETECTED
Existing spec: <path>
Existing test: <path>
Action: No new files created. Returning SKIP.
```

**Partial overlap found:**
Return EXTEND decision and list only the uncovered steps.

**No overlap:** Return CREATE decision.

---

## Phase 3 — Reuse Analysis

Before generating new code, identify what already exists:

**Page objects** (`tests/pages/`):

- Does a page object exist for the target page?
- Does it expose all methods needed by the new scenario?
- If a method is missing, can it be added without breaking existing tests?

**Test data** (`tests/data/`):

- Does the required user/product/form data already exist?
- If a new data value is needed, identify the correct file to update

**Fixtures** (`tests/fixtures.ts`):

- The fixture navigates to `baseUrl` before every test — tests must not duplicate this
- Do not modify `tests/fixtures.ts` unless explicitly instructed

Report reuse decisions in plain text before generating:

```
Reuse:
  LoginPage (tests/pages/auth/login.page.ts) — reuse existing, all methods available
  users.standard (tests/data/users.ts) — reuse existing
  CheckoutPage (tests/pages/checkout/checkout.page.ts) — reuse, add assertItemCount method
```

---

## Phase 4 — Decision Gate

Based on phases 2–3, choose exactly one:

| Decision   | Condition                                                                      |
| ---------- | ------------------------------------------------------------------------------ |
| **SKIP**   | Exact duplicate exists — no files created                                      |
| **EXTEND** | Partial coverage — update existing plan/page-object/data, create new spec file |
| **CREATE** | No overlap — create plan, spec, page object(s), and data as needed             |

---

## Phase 5 — Implement

Apply `references/plan-format.md` for plan files and `references/test-generation.md` for code.

### 5a. Plan file

For CREATE: create `specs/<feature-slug>.plan.md` following the exact format in
`references/plan-format.md`.

For EXTEND: open the existing plan file and append a new `####` scenario block.
Never renumber or remove existing scenarios.

### 5b. Test data

If new data is needed:

- Add to the appropriate file in `tests/data/`
- Follow the `as const` export pattern
- Use descriptive, non-hardcoded names

Never put raw strings for test data inside spec files.

### 5c. Page objects

If a new page is involved:

1. Use Playwright MCP (see `references/mcp-exploration.md`) to discover `data-test` values
2. Map every interactive element to a locator using the selector priority order
3. Create `tests/pages/<domain>/<page-name>.page.ts` using the template in `references/test-generation.md`
4. Declare the new page object as a fixture in `tests/fixtures.ts` so specs can inject it

Page objects MUST be placed in a domain subfolder under `tests/pages/` — never at the flat root.
Examples: `tests/pages/auth/`, `tests/pages/checkout/`, `tests/pages/cart/`

If extending an existing page object:

1. Use MCP to confirm the new element's `data-test` attribute before adding it
2. Add the new locator property and method — do not alter existing methods

**Selector priority order (strict):**

1. `page.getByTestId('<data-test-value>')`
2. `page.getByRole('<role>', { name: '<accessible-name>' })`
3. `page.getByLabel('<label-text>')`
4. `page.getByText('<visible-text>', { exact: true })`
5. `page.locator('<css-selector>')` — only when none of the above applies

### 5d. Spec file

Create `tests/<group>/<scenario-name>.spec.ts` following this exact structure:

```ts
// spec: specs/<feature>.plan.md
// seed: tests/seed.spec.ts
import { test, expect, urlPatterns } from '../fixtures';
import { <data> } from '../data/<domain>';

test.describe('<FeatureGroup>', () => {
  test('<scenario-name> @smoke', async ({ page, <pageObjectFixture> }) => {
    // Page objects injected via fixtures — never instantiate with new XPage(page).
    // Use urlPatterns.xxx for URL assertions.
    // step comments map 1:1 to plan steps
  });
});
```

For auth tests that test the login flow, add inside the describe block:

```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

This clears the project-level storageState so the test starts at the unauthenticated login page.

Rules:

- Import `test`, `expect`, and `urlPatterns` from `'../fixtures'` — never from `'@playwright/test'`
- One `test(...)` per file; always wrap in `test.describe`
- Do not call `page.goto(...)` — the fixture already navigates to `baseUrl`
- For authenticated tests, storageState is already applied via the project config
- No `page.waitForTimeout()` — use web-first assertions instead
- Tag critical happy-path tests with `@smoke`

---

## Phase 6 — Optional MCP Exploration

Use Playwright MCP when:

- The `data-test` attribute value for a new element is unknown
- The exact assertion text needs to be confirmed from the live app
- A test is failing due to a selector mismatch and the DOM needs re-inspection
- Page flow produces unexpected redirects

See `references/mcp-exploration.md` for the exact MCP tool sequence.

MCP is optional for cases where all selectors and assertion text are already
known from existing page objects and spec files.

---

## Phase 7 — Run and Heal

### 7a. Initial run

Run the new test in isolation:

```bash
npm run test:e2e -- tests/<group>/<scenario>.spec.ts
```

Or use the `runTests` tool with the specific file path.

If all tests pass, proceed to Phase 8.

### 7b. Heal loop (max 3 iterations)

If the test fails, follow the heal loop in `references/healing.md`:

1. Read the exact error message and line
2. Classify the root cause (selector / assertion text / timing / data / logic)
3. Use MCP exploration to diagnose selector or text issues
4. Apply one targeted fix
5. Re-run the failing test
6. Repeat up to 3 times

After a fix, always run:

```bash
npm run typecheck
```

After 3 failed iterations, stop and emit a BLOCKER report (see `references/healing.md`).

### 7c. Full suite check

After the targeted test passes, run the full suite to detect regressions:

```bash
npm run test:e2e
```

If any previously-passing test now fails, it is a regression introduced by this
implementation — fix it before proceeding.

---

## Phase 8 — Typecheck

```bash
npm run typecheck
```

All TypeScript errors must be resolved. Do not mark a task complete with type errors.

---

## Phase 9 — Return Results

For each test case, emit this block:

```
TEST CASE: <scenario-name>
Decision:   SKIP | EXTEND | CREATE
Plan:       specs/<feature>.plan.md  (created | updated | skipped)
Spec:       tests/<group>/<scenario>.spec.ts  (created | skipped)
Page Objects:
  - tests/pages/<name>.page.ts  (created | extended | reused)
Test Data:
  - tests/data/<domain>.ts  (created | updated | reused)
MCP Used:   YES (reason) | NO
Run Status: PASSED | HEALED (N iterations) | FAILED (blocker)
Typecheck:  PASS | FAIL
Notes:      <reconciliation changes, blockers, reuse decisions>
```

After all cases:

```
SUMMARY
Total:    <n>
Created:  <n>
Extended: <n>
Skipped:  <n>
Healed:   <n>
Failed:   <n>
```
