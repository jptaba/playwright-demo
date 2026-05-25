# Playwright MCP Project Instructions

## Purpose

This repository uses a Playwright Test + Playwright MCP workflow for planning, generating,
running, and healing Playwright TypeScript tests. No Playwright CLI agent or planner/generator/
healer extension is installed or needed — all those capabilities are implemented through the
orchestration skill and Playwright MCP.

---

## Automating Test Cases (primary entry point)

When a user provides test cases (steps, Gherkin, or plain English):

1. **Load the orchestration skill first:** `.github/skills/automate-test-case/SKILL.md`
2. The skill is the single source of truth for all phase order, gates, and constraints.
3. The user-facing prompt (`.github/prompts/automate-test-cases.prompt.md`) is a thin wrapper
   that delegates to the skill.

**Preflight — confirm these exist before starting:**

- `.github/skills/automate-test-case/SKILL.md`
- `tests/seed.spec.ts`
- `tests/fixtures.ts`

If any prerequisite is missing, stop and report what is missing.

**Pipeline phases (orchestrated by the skill):**

| #   | Phase                                              |
| --- | -------------------------------------------------- |
| 0   | Load project context                               |
| 1   | Parse input test cases                             |
| 2   | Duplicate detection                                |
| 3   | Reuse analysis                                     |
| 4   | Decision gate (SKIP / EXTEND / CREATE)             |
| 5   | Implement (plan → page objects → test data → spec) |
| 6   | Optional Playwright MCP exploration                |
| 7   | Run and heal (max 3 iterations)                    |
| 8   | Typecheck                                          |
| 9   | Return results per case + summary                  |

---

## MCP-Native Capabilities

Playwright MCP (`.vscode/mcp.json`) replaces the interactive explore/snapshot/eval workflow:

| Old CLI capability             | MCP replacement                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `playwright-cli snapshot`      | `browser_snapshot` after `browser_navigate`                                        |
| `playwright-cli eval <script>` | `browser_evaluate` with a JS expression                                            |
| `playwright-cli attach`        | Step through `browser_click` / `browser_fill` interactively                        |
| Selector healing               | `browser_snapshot` at failure state + `browser_evaluate` for `data-test` discovery |
| Assertion text discovery       | `browser_evaluate` reading `element.textContent.trim()`                            |

See `.github/skills/automate-test-case/references/mcp-exploration.md` for full usage guide.

---

## Core Workflow (manual / single spec)

1. Create or update a spec under `specs/*.plan.md` (see `references/plan-format.md`)
2. Generate test code under `tests/**` using page objects and fixtures
3. Use Playwright MCP if selector or assertion text discovery is needed
4. Run tests with `npm run test:e2e`
5. Heal failures using the heal loop (see `references/healing.md`)
6. Run `npm run typecheck` — all errors must be resolved

---

## Project Layout

| Path                                 | Purpose                                                                                      |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `playwright.config.ts`               | Config — `baseURL = BASE_URL env`, `testIdAttribute = data-test`, setup + 3 browser projects |
| `tsconfig.json`                      | TypeScript strict, Node16 module resolution                                                  |
| `tests/fixtures.ts`                  | Extended fixture — navigates to `baseUrl`; injects `loginPage`, `checkoutPage`               |
| `tests/seed.spec.ts`                 | Minimal smoke anchor test                                                                    |
| `tests/support/env.ts`               | Centralised env config (`BASE_URL`)                                                          |
| `tests/support/config.ts`            | Framework constants — `authStorageState`, `urlPatterns`                                      |
| `tests/setup/`                       | Global setup — generates `artifacts/auth/standard-user.json`                                 |
| `tests/helpers/`                     | Shared utilities (`captureEvidence`, `scrollToBottom`)                                       |
| `tests/data/`                        | Test data (`users.ts`, `checkout.ts`, …)                                                     |
| `tests/pages/auth/`                  | Auth page objects (`login.page.ts`)                                                          |
| `tests/pages/checkout/`              | Checkout page objects (`checkout.page.ts`)                                                   |
| `tests/auth/`                        | Auth spec files                                                                              |
| `tests/checkout/`                    | Checkout spec files                                                                          |
| `specs/`                             | Official plan files (`*.plan.md`)                                                            |
| `.github/skills/automate-test-case/` | Orchestration skill + references                                                             |
| `.github/prompts/`                   | User-facing prompt entry points                                                              |
| `.github/workflows/`                 | CI pipeline (`e2e.yml`)                                                                      |
| `.vscode/mcp.json`                   | Playwright MCP server config                                                                 |
| `.vscode/extensions.json`            | Recommended VS Code extensions                                                               |
| `.vscode/settings.json`              | Workspace editor settings                                                                    |
| `artifacts/mcp/`                     | MCP output (snapshots, screenshots)                                                          |
| `artifacts/auth/`                    | Cached browser auth state (gitignored)                                                       |

---

## Authoring Rules

Apply in priority order — higher numbers must not override lower numbers:

| Priority | Category       | Rule                                                                                               |
| -------- | -------------- | -------------------------------------------------------------------------------------------------- |
| 1        | Workflow       | Follow orchestration skill phases; run `npm run typecheck` after every TypeScript edit             |
| 2        | Test structure | Import `test` and `expect` from `tests/fixtures.ts`; one test per `.spec.ts` file                  |
| 3        | Selectors      | Selector order: `getByTestId` → `getByRole` → `getByLabel` → `getByText`; never `waitForTimeout()` |
| 4        | Data           | Never hardcode test data in spec files; all data lives in `tests/data/`                            |

---

## Automation References

| Reference             | Path                                                              |
| --------------------- | ----------------------------------------------------------------- |
| Orchestration skill   | `.github/skills/automate-test-case/SKILL.md`                      |
| MCP exploration guide | `.github/skills/automate-test-case/references/mcp-exploration.md` |
| Plan file format      | `.github/skills/automate-test-case/references/plan-format.md`     |
| Test generation rules | `.github/skills/automate-test-case/references/test-generation.md` |
| Heal loop guide       | `.github/skills/automate-test-case/references/healing.md`         |
| MCP server config     | `.vscode/mcp.json`                                                |
| Playwright test docs  | https://playwright.dev/docs/intro                                 |
