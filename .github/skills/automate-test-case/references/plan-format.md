# Plan File Format Reference

Every `specs/*.plan.md` file must follow this exact format so the orchestration skill
can parse it unambiguously.

---

## Top-level structure

```markdown
# <Application / Feature> Test Plan

## Application Overview

<One paragraph describing the application and scope of this plan.>

## Test Scenarios

### <N>. <Feature Group Name>

**Seed:** `tests/seed.spec.ts`

#### <N.M>. <scenario-name-in-kebab-case>

**File:** `tests/specs/<group>/<scenario-name-in-kebab-case>.spec.ts`

**Steps:**

1. <User-level action description>.
   - expect: <Observable outcome>.
   - expect: <Additional observable outcome if needed>.

2. <Next action>.
   - expect: <Observable outcome>.
```

---

## Rules

### Naming

- Plan file: `specs/<feature-slug>.plan.md` (kebab-case)
- Scenario `#### heading`: kebab-case matching the spec file name exactly
- `**File:**` path must match the scenario heading

### Step wording

- Write steps at user / business level — no code, no selectors
- Every step must have at least one `- expect:` bullet
- Use exact visible text for assertions (e.g. `"Thank you for your order!"`)
- Do not mention CSS classes or data attributes — those belong in page objects

### Seed

- `**Seed:**` is always `tests/seed.spec.ts`
- The seed test navigates to `baseUrl` via the fixture before each test

### One scenario = one spec file

- Never put two scenarios in a single `spec.ts` file
- A plan file may contain multiple scenarios under different `####` headings

---

## Example — full plan file

```markdown
# SauceDemo Authentication Test Plan

## Application Overview

SauceDemo is a login-gated storefront. This plan covers successful login behavior.

## Test Scenarios

### 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. should-login-standard-user

**File:** `tests/specs/auth/should-login-standard-user.spec.ts`

**Steps:**

1. Fill username with standard_user.
   - expect: Username field contains standard_user.

2. Fill password with secret_sauce.
   - expect: Password field contains secret_sauce.

3. Submit the login form.
   - expect: URL contains /inventory.html.
   - expect: Products heading is visible.
```

---

## Extending an existing plan

When adding a new scenario to an existing plan file:

1. Add a new `####` block under the same `###` feature group, or create a new `###` group
2. Increment the numbering (`1.3`, `2.1`, etc.)
3. Follow the same step/expect format
4. Never remove or renumber existing scenarios

---

## Reconciling after healing

If a heal loop discovers that actual behaviour differs from the spec steps, update the plan:

- Correct the `expect:` text to match what the application actually shows
- Add a `> Note:` line after the relevant step explaining what changed
- Example:

```markdown
3. Submit the login form.
   - expect: URL contains /inventory.html.
   - expect: Products heading is visible.
     > Note: Heading text confirmed as "Products" (not "Inventory") during healing on 2026-05-24.
```
