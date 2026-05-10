# Playwright CLI Skill Project Instructions

## Purpose

This repository uses the official Playwright CLI skill workflow for planning, generating, and healing Playwright tests.

## Automating Test Cases (primary entry point)

When a user provides test cases (steps, Gherkin, or plain English), use the full intelligent pipeline:

If test cases are missing required actions/steps, expected outcomes, or cannot be parsed as steps, Gherkin, or plain English scenarios, stop and request clarification by listing the exact missing items and an example of the expected format.

1. **Load the orchestration skill first**: `.github/skills/automate-test-case/SKILL.md`
2. Use the user-facing prompt as a guide: `.github/prompts/automate-test-cases.prompt.md`

The orchestration skill is the **single source of truth** for phase order, decision gates,
healing behavior, and constraints, and execution logic must follow it exactly. Prompt files
should stay concise by referencing that skill instead of duplicating its full procedures.
If the orchestration skill file is missing, incomplete, or invalid, return an error and halt.
Required prerequisites are: `.github/skills/automate-test-case/SKILL.md`,
`tests/seed.spec.ts`, `tests/fixtures.ts`, Playwright CLI availability, and required env
values for this repo (for example `BASE_URL` when needed). If prerequisites are missing,
attempt resolution by checking those paths and running documented setup scripts; if still
unresolved, stop and return missing item(s), setup command(s) attempted, and failure output.

The pipeline covers these phases in order:

1. Project context loading
2. Duplicate detection
3. Reuse analysis
4. Plan
5. Generate
6. Explore (playwright-cli)
7. Run
8. Heal
9. Typecheck
10. Repeat for each test case

## Core Workflow (manual / single spec)

1. Install and use official Playwright CLI skills.
2. Create or update a spec file under specs/\*.plan.md.
3. Start from TypeScript seed test via Playwright debug CLI mode.
4. Use playwright-cli commands to explore, generate test code, and refine assertions.
5. Run tests and heal failures using the official spec-driven workflow.

## Project Layout

```
playwright.config.ts          Configuration (baseURL = BASE_URL env, testIdAttribute = data-test)
tsconfig.json                 TypeScript strict, Node16 module resolution
tests/
  fixtures.ts                 Extended fixture — navigates to baseUrl before each test
  seed.spec.ts                Seed test for playwright-cli attach
  support/env.ts              Environment config
  data/users.ts               Centralized test data
  pages/                      Page Object classes (*.page.ts)
  auth/                       Auth test specs
specs/                        Official plan files (*.plan.md)
.claude/skills/playwright-cli/ Official Playwright CLI skills
.github/skills/               Copilot orchestration skills
.github/prompts/              User-facing prompt entry points
```

## Required Tools and Config

- Playwright test runner from @playwright/test
- Playwright CLI from @playwright/cli
- Official skill files installed under .claude/skills/playwright-cli

## Authoring Rules

Apply priorities in numeric order with strict dependency handling: finish all Priority 1
tasks first, then Priority 2, then Priority 3, then Priority 4.

| Priority | Category                | Rule                                                                                                            |
| -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1        | Workflow and validation | Follow orchestration workflow and run `npm run typecheck` after TypeScript edits.                               |
| 2        | Test structure          | Import `test` and `expect` from `tests/fixtures.ts` and keep one test per `.spec.ts` file.                      |
| 3        | Selectors and timing    | Use selector order `getByTestId` → `getByRole` → `getByLabel` → `getByText`; never use `page.waitForTimeout()`. |
| 4        | Data management         | Never hardcode test data in spec files; use `tests/data/`.                                                      |

Conflict examples:

- If workflow requires restructuring generated tests before validation, complete workflow/typecheck first (Priority 1), then apply structure cleanup (Priority 2).
- If a stable test id is unavailable, follow selector fallback order from Priority 3 and keep data sourcing from Priority 4 unchanged.
- If a Priority 2 task depends on a Priority 1 task, complete the Priority 1 task first and document the dependency in the result summary.

## Automation References

- Orchestration skill: .github/skills/automate-test-case/SKILL.md
- Official spec-driven guide: .claude/skills/playwright-cli/references/spec-driven-testing.md
- Playwright CLI: https://github.com/microsoft/playwright-cli
- Playwright test docs: https://playwright.dev/docs/intro
