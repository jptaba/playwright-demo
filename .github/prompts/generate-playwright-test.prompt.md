---
agent: agent
description: >
  Use when you want to generate and run Playwright tests from an existing plan spec file.
  Executes the repository's MCP-native spec-driven workflow: validate → generate →
  optionally explore with MCP → run → heal (max 3 iterations) → typecheck.
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

# Generate Playwright Test from Spec

## Input

- Required: `specPath` — workspace-relative path to a `specs/*.plan.md` file

## Phase 1 — Validation

Before proceeding, verify:

1. `specPath` exists and ends with `.plan.md`
2. Spec contains at least one `####` scenario block
3. `tests/seed.spec.ts` exists
4. `tests/fixtures.ts` exists

On failure:

```
STATUS: INPUT_ERROR
Reason: <clear reason>
Missing: <paths if any>
```

## Phase 2 — Execution

Follow `.github/skills/automate-test-case/SKILL.md` exactly. That skill is the
authoritative source for phase order, decision gates, and constraints.

Supporting references:

| Reference             | Path                                                              |
| --------------------- | ----------------------------------------------------------------- |
| MCP exploration guide | `.github/skills/automate-test-case/references/mcp-exploration.md` |
| Plan file format      | `.github/skills/automate-test-case/references/plan-format.md`     |
| Test generation rules | `.github/skills/automate-test-case/references/test-generation.md` |
| Heal loop guide       | `.github/skills/automate-test-case/references/healing.md`         |

Run sequence:

1. Read the spec — summarize each scenario targeted in this run
2. Perform duplicate detection and reuse analysis (Phases 2–3 in SKILL.md)
3. Generate or update test implementation (Phase 5 in SKILL.md)
4. Optionally use Playwright MCP for exploration when selectors or assertions are unclear
5. Run Playwright test(s)
6. If failures occur, apply the heal loop (max 3 iterations, see `references/healing.md`)
7. Run `npm run typecheck` — fix all errors before completing

## MCP exploration

When selector or assertion text is unknown, use MCP tools:

- `browser_navigate` → `browser_snapshot` to read `data-test` attributes
- `browser_evaluate` with `element.textContent.trim()` for exact assertion text
- `browser_click` / `browser_fill` to reach the target page state

See `references/mcp-exploration.md` for full usage guide.

## Phase 3 — Return format

```
STATUS:           SUCCESS | PARTIAL | FAILED
Spec:             <path>
Scenarios:        <count and names>
Decision:         SKIP | EXTEND | CREATE
GeneratedFiles:
  - <path>
UpdatedFiles:
  - <path>
MCP Used:         YES (<reason>) | NO
TestRun:          PASS | FAIL
HealIterations:   <0-3>
Typecheck:        PASS | FAIL
SpecReconciliation:
  - <none or list of spec updates made during healing>
Notes:
  - <blockers, reuse decisions, or recommendations>
```
