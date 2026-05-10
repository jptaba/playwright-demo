---
agent: agent
description: >
  Use when you want to generate and run Playwright tests from an existing spec file
  using the official Playwright CLI spec-driven workflow.
tools:
  - read_file
  - file_search
  - grep_search
  - create_file
  - apply_patch
  - run_in_terminal
  - runTests
  - get_errors
---

Given a spec file path in this repo, execute the official Playwright CLI workflow:

Key constraints summary:

- Priority 1 - Workflow order: follow plan -> generate -> run -> heal (max 3 iterations) -> typecheck.
- Priority 2 - Reuse and data: reuse existing page objects and test data when available; avoid hardcoded test data in spec files.
- Priority 3 - Reliability: use repository fixtures and avoid arbitrary sleep-based waits.

## Inputs

- Required: `specPath` (workspace-relative path to a `.plan.md` file)

## Phase 1 - Validation

1. `specPath` exists and ends with `.plan.md`
2. Spec has at least one scenario block
3. `tests/seed.spec.ts` exists
4. `tests/fixtures.ts` exists

If any validation fails, stop and return:

```
STATUS: INPUT_ERROR
Reason: <clear reason>
Missing: <paths if any>
```

Proceed to Phase 2 only if all validation checks pass.

## Phase 2 - Execution

Follow the official workflow and constraints from:

- `.github/skills/automate-test-case/SKILL.md`
- `.claude/skills/playwright-cli/references/spec-driven-testing.md`

If instructions conflict, `.github/skills/automate-test-case/SKILL.md` takes precedence.

Follow the workflow exactly as described in `.github/skills/automate-test-case/SKILL.md` and `.claude/skills/playwright-cli/references/spec-driven-testing.md`, without introducing additional steps, modifications, or optimizations.

Run sequence:

1. Read the spec and summarize scenarios targeted in this run.
2. Start seed test in debug CLI mode and attach with playwright-cli.
3. Generate or update test implementation for the spec scenario(s).
4. Run Playwright test(s).
5. If failures occur, run heal loop (max 3 iterations) and reconcile spec updates.
6. Run `npm run typecheck` before completion.

If `npm run typecheck` fails, return:

```
STATUS: FAILED
Reason: Typecheck failure
```

Use this command sequence:

- npm run test:seed:debug
- npx playwright-cli attach <session-name>
- npm run test:e2e

Proceed to Phase 3 after execution completes.

## Phase 3 - Return format

Return:

```
STATUS: SUCCESS | PARTIAL | FAILED
Spec: <path>
Scenarios: <count and names>
Decision: SKIP | EXTEND | CREATE
GeneratedFiles:
- <path>
UpdatedFiles:
- <path>
TestRun: PASS | FAIL
HealIterations: <0-3>
Typecheck: PASS | FAIL
SpecReconciliation:
- <none or list of updates>
Recommendations:
- <next actions if any>
```
