# Playwright Demo

This repository is a TypeScript-first Playwright automation demo.
It combines:

- Official Playwright Test capabilities (projects, retries, reporting, traces, videos)
- Repository spec-driven workflow (plan → generate → run → heal)
- Playwright MCP for optional agentic browser exploration
- Global auth setup with `storageState` for fast, isolated tests

## Core Principles

- Type-safe tests and fixtures using strict TypeScript
- Deterministic, resilient locators and assertions
- Spec-driven authoring for scalable agent-assisted coverage
- Auth state cached once per run — no login duplication across test suite
- Rich diagnostics for CI and local triage

## Tech Stack

- `@playwright/test`
- `@playwright/mcp`
- TypeScript (strict)
- dotenv for environment configuration

## Project Layout

```
playwright.config.ts        Runtime config (baseURL, testIdAttribute, setup + 3 browser projects)
tsconfig.json               TypeScript strict, Node16 module resolution
tests/
  fixtures.ts               Shared typed fixtures (page, loginPage, checkoutPage, urlPatterns)
  seed.spec.ts              Seed/smoke anchor test
  setup/
    global.setup.ts         Global auth setup — writes artifacts/auth/standard-user.json
  support/
    env.ts                  Centralised env config (BASE_URL)
    config.ts               Framework constants (authStorageState, urlPatterns)
  helpers/
    index.ts                Shared utilities (captureEvidence, scrollToBottom)
  data/
    users.ts                Centralised user test data
    checkout.ts             Centralised checkout test data
  pages/
    auth/
      login.page.ts         LoginPage page object
    checkout/
      checkout.page.ts      CheckoutPage page object
  auth/
    should-login-standard-user.spec.ts
  checkout/
    should-complete-checkout-with-single-item.spec.ts
    should-readd-removed-item-with-second-item.spec.ts
specs/                      Plan files (*.plan.md)
.github/
  copilot-instructions.md   Always-on Copilot agent instructions
  prompts/                  User-facing Copilot prompt entry points
  skills/
    automate-test-case/     Orchestration skill + references
  workflows/
    e2e.yml                 GitHub Actions CI pipeline (sharded)
.vscode/
  mcp.json                  Playwright MCP server config
  extensions.json           Recommended VS Code extensions
  settings.json             Workspace editor settings
artifacts/                  Gitignored — all test output
  auth/                     Cached browser auth state
  html-report/              Playwright HTML report
  reports/                  JUnit + JSON reports
  test-results/             Trace, screenshots, videos
  mcp/                      MCP exploration screenshots
```

## Quick Start

```bash
npm install
npm run setup:browsers
npm run typecheck
npm run test:e2e
```

## Environment

Copy `.env.example` to `.env` and set values as needed.

- `BASE_URL`: app URL used by fixtures and config (default: `https://www.saucedemo.com`)

## Auth State Pattern

The `setup` project in `playwright.config.ts` runs first and saves authenticated
browser state to `artifacts/auth/standard-user.json`. All browser projects then
load that state — tests start at the authenticated inventory page without repeating login.

Auth tests that test the login flow use `test.use({ storageState: { cookies: [], origins: [] } })`
to bypass cached auth and test the real login flow.

## Test Tags

| Tag      | Use                                                    |
| -------- | ------------------------------------------------------ |
| `@smoke` | Critical happy path — runs in `npm run test:e2e:smoke` |

## Common Commands

```bash
npm run typecheck           # TypeScript validation
npm run test:e2e            # Full suite (all browsers)
npm run test:e2e:smoke      # @smoke tests only
npm run test:e2e:ci         # CI mode (retries, parallel)
npm run test:e2e:ui         # Playwright UI mode
npm run test:e2e:debug      # Debug mode
npm run test:e2e:report     # Open last HTML report
```

## Spec-Driven Agent Workflow

1. Create or update `specs/<feature>.plan.md`
2. Generate tests using `.github/prompts/automate-test-cases.prompt.md`
3. Optionally use Playwright MCP exploration to validate selectors/assertions
4. Run and heal with the orchestration skill in `.github/skills/automate-test-case/SKILL.md`
