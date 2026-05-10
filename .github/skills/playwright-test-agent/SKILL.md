---
name: playwright-test-agent
description: 'Use when you need official Playwright CLI spec-driven planning, generation, execution, and healing for repository scenarios. Triggers: playwright-cli, spec-driven testing, plan generate heal, seed test debug cli.'
---

# Playwright CLI Skill Wrapper

Use the official installed skill at .claude/skills/playwright-cli/SKILL.md.
If that skill is missing or inaccessible, stop and ask the user to run `npm run setup:cli-skills`. Retry only after explicit confirmation from the user.
If Playwright CLI is not installed, ask the user to run `npm install -g playwright-cli`, then continue after explicit confirmation.

This wrapper coordinates repository-specific expectations and should defer detailed browser command behavior to the official skill.

Primary reference for this repository:

- .claude/skills/playwright-cli/references/spec-driven-testing.md

Expected repository workflow:

1. Ensure a seed test exists at tests/seed.spec.ts.
2. Author spec files in specs/\*.plan.md using official format.
3. Run seed in debug CLI mode and attach via playwright-cli.
4. Generate scenario tests from the spec, then run npx playwright test.
5. Heal failing tests using the official heal loop (a sequence of up to 3 diagnose-fix-rerun iterations), then reconcile the spec.

Preflight validation gates (perform in order):

1. Check specs/\*.plan.md exists for the target scenario. If missing, stop with INPUT_ERROR.
2. If specs/\*.plan.md exists, check tests/seed.spec.ts exists. If missing, stop with INPUT_ERROR.
3. If both previous checks pass, check tests/fixtures.ts exists. If missing, stop with INPUT_ERROR.

If any gate fails, stop with:

```
STATUS: INPUT_ERROR
Reason: <clear reason>
Missing: <paths if any>
```

Required reporting contract:

```
STATUS: SUCCESS | PARTIAL | FAILED
Spec: <path>
GeneratedFiles:
- <path>
UpdatedFiles:
- <path>
TestRun: PASS | FAIL
HealIterations: <0-3>
Typecheck: PASS | FAIL
SpecReconciliation:
- <none or list of updates>
```

Recommended commands:

- npm run setup:cli-skills
- npm run test:seed:debug
- npx playwright-cli attach <session-name>
- npm run test:e2e
