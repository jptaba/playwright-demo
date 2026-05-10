---
agent: agent
description: >
  Use when you want to automate one or more Playwright test cases end-to-end.
  Runs duplicate detection, reuse analysis, plan, generation, execution, healing,
  and typecheck using the repository orchestration skill.
  Accept test cases from chat, file reference, or both. If both are provided, treat file content as primary; when inputs conflict, ignore conflicting chat details and keep file content.
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

# Automate Playwright Test Cases

## How to use this prompt

Supply your test cases below — any format is accepted:

- **Steps list** (numbered steps with expected outcomes)
- **Gherkin / BDD** (Given / When / Then)
- **Plain English** (describe what the test should verify)
- **Attached file** (reference a `.md`, `.txt`, or `.feature` file in the chat)

You may supply **one or many** test cases at once. Each is processed sequentially.

## Inputs

- Required: one or more test cases in chat or attached file content
- Supported formats: steps list, Gherkin/BDD, or plain English

---

## Execution source of truth

The full workflow and rules are defined in:

- `.github/skills/automate-test-case/SKILL.md` (authoritative orchestration)
- `.claude/skills/playwright-cli/references/spec-driven-testing.md`
- `.claude/skills/playwright-cli/references/test-generation.md`
- `.claude/skills/playwright-cli/references/healing.md`

Do not redefine workflow logic in this prompt. Use the orchestration skill as the workflow source, then apply this prompt sections in order: Validation gates, Execution source of truth, and Required output format. If validation fails, return INPUT_ERROR and stop.

---

## Validation gates before execution

Before processing test cases, run these checks:

| Check                  | Condition                                                                                             | On failure                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------- |
| Required project files | `.github/skills/automate-test-case/SKILL.md`, `tests/seed.spec.ts`, and `tests/fixtures.ts` all exist | Return INPUT_ERROR and stop |
| Input presence         | At least one test case is provided in user input or attached file                                     | Return INPUT_ERROR and stop |

---

## Required output format

Return one block per test case using this structure:

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

After all cases, include:

```
SUMMARY
Total Cases: <n>
Created: <n>
Extended: <n>
Skipped: <n>
Failed: <n>
```

If execution cannot start because validation fails, return:

```
STATUS: INPUT_ERROR
Reason: <clear reason>
Missing: <paths if any>
```

---

## Paste your test cases below

<!-- Replace this block with your test cases -->

```
Test Case 1: <Title>
Steps:
  1. <Action>
     - expect: <outcome>
  2. <Action>
     - expect: <outcome>

Test Case 2: <Title>
Steps:
  1. <Action>
     - expect: <outcome>
```
