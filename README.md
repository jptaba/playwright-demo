# Playwright Demo

This repository is a TypeScript-first Playwright automation demo.
It combines:

- Official Playwright Test capabilities (projects, retries, reporting, traces, videos)
- Official Playwright CLI skill workflow (plan -> generate -> heal)
- Playwright MCP for optional agentic browser exploration

## Core Principles

- Type-safe tests and fixtures using strict TypeScript
- Deterministic, resilient locators and assertions
- Spec-driven authoring for scalable agent-assisted coverage
- Rich diagnostics for CI and local triage

## Tech Stack

- @playwright/test
- @playwright/cli
- TypeScript (strict)
- dotenv for environment configuration

## Project Layout

- specs: plan files in official spec-driven format (\*.plan.md)
- tests/fixtures.ts: shared typed fixtures
- tests/seed.spec.ts: seed entrypoint for debug CLI attach sessions
- tests/auth: scenario tests
- tests/pages: page objects
- tests/data: centralized test data
- tests/support: framework support utilities
- playwright.config.ts: enterprise runtime configuration
- .claude/skills/playwright-cli: official installed skill pack
- .vscode/mcp.json: Playwright MCP server config

## Quick Start

```bash
npm install
npm run setup:browsers
npm run setup:cli-skills
npm run typecheck
npm run test:e2e
```

## Environment

Copy .env.example to .env and set values as needed.

- BASE_URL: app URL used by fixtures and config

## Official Spec-Driven Agent Workflow

1. Create or update specs/<feature>.plan.md
2. Start debug seed:

```bash
npm run test:seed:debug
```

3. Attach Playwright CLI to the printed session name:

```bash
npx playwright-cli attach tw-XXXX
```

4. Generate test steps/assertions into TypeScript test files.
5. Run all tests:

```bash
npm run test:e2e
```

6. Heal failures using:

- .claude/skills/playwright-cli/references/spec-driven-testing.md

## Common Commands

- npm run typecheck
- npm run test:e2e
- npm run test:e2e:smoke
- npm run test:e2e:ci
- npm run test:e2e:ui
- npm run cli -- snapshot
- npm run cli -- show --annotate

## Example

- Plan: specs/saucedemo-auth.plan.md
- Scenario test: tests/auth/should-login-standard-user.spec.ts

## Integration Notes

- Primary generation/heal loop uses official Playwright CLI skills.
- Playwright MCP in .vscode/mcp.json remains available for exploratory automation or specialized agent loops.
