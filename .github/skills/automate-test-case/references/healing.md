# Heal Loop Reference

Use this reference when a generated test fails after the first run. The heal loop
mimics the diagnose-fix-rerun cycle that Playwright CLI's healer agent performed.

---

## Heal loop rules

- Maximum **3 iterations** per test case
- After 3 iterations without a passing run: stop, document the blocker, do not continue
- Each iteration must fix at least one distinct issue — do not re-apply the same fix
- After healing, reconcile the spec file if the actual app behaviour differs from the plan

---

## Iteration structure

For each failing iteration:

```
HEAL ITERATION <N>
Error: <exact error from test output>
Root cause: <selector mismatch | wrong assertion text | timing issue | data issue | logic bug>
Fix applied: <what was changed and where>
Re-run result: PASS | FAIL
```

---

## Step 1 — Read the full error

Run the failing test in isolation first:

```bash
npm run test:e2e -- tests/specs/<group>/<scenario>.spec.ts
```

Collect:

1. The exact error message (do not paraphrase)
2. The line number and file where it failed
3. The action that triggered it (click, fill, expect, navigate)

---

## Step 2 — Classify the root cause

| Symptom                                            | Root cause             | Fix strategy                              |
| -------------------------------------------------- | ---------------------- | ----------------------------------------- |
| `Locator ... not found` or `strict mode violation` | Selector mismatch      | Use MCP to re-inspect the element         |
| `Expected: "X" Received: "Y"`                      | Wrong assertion text   | Use MCP to read actual text               |
| `Timeout exceeded waiting for ...`                 | Timing / missing await | Add web-first assertion before the action |
| `Cannot read properties of undefined`              | Data missing           | Check `tests/data/` export exists         |
| `Type error`                                       | TypeScript mismatch    | Run `npm run typecheck` to isolate        |
| Test reaches wrong page                            | Logic / flow bug       | Trace the step sequence against the plan  |

---

## Step 3 — Use MCP to diagnose selector / text issues

When the error is a locator or assertion text mismatch, use MCP exploration
(see `mcp-exploration.md`) to reach the failing state and inspect:

1. Navigate to `baseUrl` and reproduce the steps up to the failure point
2. Take a `browser_snapshot` at the failing state
3. Use `browser_evaluate` to read the exact attribute or text
4. Update the page object or assertion with the confirmed value

---

## Step 4 — Apply the fix

Selector fix example:

```ts
// Before (wrong)
this.errorMessage = page.getByTestId('error-message');
// After (confirmed via MCP snapshot)
this.errorMessage = page.locator('[data-test="error-message-container"]');
```

Assertion text fix example:

```ts
// Before (guessed)
await expect(this.completeHeader).toHaveText('Order complete!');
// After (confirmed via MCP evaluate)
await expect(this.completeHeader).toHaveText('Thank you for your order!');
```

Timing fix example:

```ts
// Before (action fires before element is ready)
await loginPage.submit();
await checkoutPage.addItemToCart(item);
// After (wait for navigation before proceeding)
await loginPage.submit();
await expect(page).toHaveURL(/\/inventory\.html/);
await checkoutPage.addItemToCart(item);
```

---

## Step 5 — Re-run and check

```bash
npm run test:e2e -- tests/specs/<group>/<scenario>.spec.ts
```

- If PASS: proceed to typecheck and spec reconciliation
- If FAIL: start the next iteration with a fresh error classification

---

## Step 6 — Typecheck after every fix

```bash
npm run typecheck
```

Fix TypeScript errors before proceeding to the next iteration or marking done.

---

## Step 7 — Reconcile the spec

If the actual app behaviour differs from what the plan described:

- Open `specs/<feature>.plan.md`
- Update the `expect:` bullet to match reality
- Add a `> Note:` line on what was discovered during healing

Example:

```markdown
3. Finish checkout.
   - expect: Success confirmation shows "Thank you for your order!".
     > Note: Text confirmed as "Thank you for your order!" (not "Order complete!") during healing.
```

---

## Blocker report (when 3 iterations fail)

```
HEAL BLOCKER
Scenario: <scenario-name>
Iterations attempted: 3
Last error: <exact error message>
Root cause hypothesis: <best assessment>
Steps to reproduce manually:
  1. <step>
  2. <step>
Recommended next action: <manual investigation | environment check | skip>
```
