---
agent: agent
description: >
  Use when you want to automate one or more Playwright test cases end-to-end.
  Runs duplicate detection, reuse analysis, plan, generation, execution, healing,
  and typecheck using the repository orchestration skill and Playwright MCP.
  Accept test cases from chat, file reference, or both. If both are provided,
  treat file content as primary; when inputs conflict, ignore conflicting chat
  details and keep file content.
tools:
  - read_file
  - file_search
  - grep_search
  - create_file
  - replace_string_in_file
  - run_in_terminal
  - runTests
  - get_errors
  - browser_navigate
  - browser_snapshot
  - browser_click
  - browser_fill
  - browser_evaluate
  - browser_press_key
  - browser_wait_for
  - browser_select_option
  - browser_hover
  - browser_go_back
  - browser_reload
---

# Automate Playwright Test Cases

## How to use this prompt

Supply your test cases below — any format is accepted:

- **Steps list** (numbered steps with expected outcomes)
- **Gherkin / BDD** (Given / When / Then)
- **Plain English** (describe what the test should verify)
- **Attached file** (reference a `.md`, `.txt`, or `.feature` file in the chat)

You may supply **one or many** test cases at once. Each is processed sequentially.

---

## Execution source of truth

All workflow logic, phase order, decision gates, and constraints are defined in:

- `.github/skills/automate-test-case/SKILL.md`

Supporting references:

| Reference             | Path                                                              |
| --------------------- | ----------------------------------------------------------------- |
| MCP exploration guide | `.github/skills/automate-test-case/references/mcp-exploration.md` |
| Plan file format      | `.github/skills/automate-test-case/references/plan-format.md`     |
| Test generation rules | `.github/skills/automate-test-case/references/test-generation.md` |
| Heal loop guide       | `.github/skills/automate-test-case/references/healing.md`         |

Do not redefine workflow logic here. Follow the skill exactly.

---

## Validation gates before execution

| Check                  | Condition                                                                                             | On failure                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------- |
| Required project files | `.github/skills/automate-test-case/SKILL.md`, `tests/seed.spec.ts`, and `tests/fixtures.ts` all exist | Return INPUT_ERROR and stop |
| Input presence         | At least one test case is provided in user input or attached file                                     | Return INPUT_ERROR and stop |

---

## MCP exploration

Use Playwright MCP tools when selectors or assertion text are unknown or ambiguous.
See `references/mcp-exploration.md` for the full sequence.

MCP tool quick reference:

- `browser_navigate` — go to a URL
- `browser_snapshot` — read current page structure and `data-test` attributes
- `browser_evaluate` — run a JS expression (use for exact text extraction)
- `browser_click`, `browser_fill` — interact with elements
- `browser_wait_for` — wait for a selector or URL pattern

---

## Required output format

Return one block per test case:

```
TEST CASE: <scenario-name>
Decision:   SKIP | EXTEND | CREATE
Plan:       specs/<feature>.plan.md  (created | updated | skipped)
Spec:       tests/specs/<group>/<scenario>.spec.ts  (created | skipped)
Page Objects:
  - tests/pages/<name>.page.ts  (created | extended | reused)
Test Data:
  - tests/data/<domain>.ts  (created | updated | reused)
MCP Used:   YES (<reason>) | NO
Run Status: PASSED | HEALED (<N> iterations) | FAILED (blocker)
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

If execution cannot start because validation fails:

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
