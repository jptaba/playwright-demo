# MCP Exploration Reference

Use Playwright MCP (configured in `.vscode/mcp.json`) to explore the live application
whenever a selector, assertion text, or page flow is unclear. This replaces the
interactive snapshot/eval/attach pattern that Playwright CLI provided.

MCP is optional — skip it when the DOM structure is already known from existing page objects.

---

## When to use MCP exploration

| Situation                                            | Action                                        |
| ---------------------------------------------------- | --------------------------------------------- |
| Need to confirm a `data-test` attribute value        | Navigate and inspect                          |
| Assertion text is unknown (e.g. exact error message) | Navigate to the state and read the text       |
| Page flow has unexpected redirects                   | Step through the flow interactively           |
| Healer needs to understand why a locator fails       | Take a snapshot of the failing state          |
| Creating a new page object from scratch              | Map all relevant locators before writing code |

---

## MCP workflow pattern

### 1. Navigate to the starting state

Open the base URL (the fixture always lands here):

```
browser_navigate  url: https://www.saucedemo.com
```

Take an initial snapshot to read the page structure:

```
browser_snapshot
```

### 2. Read `data-test` attribute values

The project uses `testIdAttribute: 'data-test'` in `playwright.config.ts`.
After taking a snapshot, look for `data-test="..."` attributes on elements.

For elements not visible in the snapshot text, use:

```
browser_evaluate  script: "JSON.stringify([...document.querySelectorAll('[data-test]')].map(el => ({ tag: el.tagName, dataTest: el.getAttribute('data-test'), text: el.textContent.trim().slice(0, 60) })))"
```

### 3. Perform actions and observe state

Fill a field:

```
browser_fill  selector: [data-test="username"]  value: standard_user
```

Click a button:

```
browser_click  selector: [data-test="login-button"]
```

Take a snapshot after each action to verify the result:

```
browser_snapshot
```

### 4. Read exact assertion text

To get the exact visible text for an `expect` assertion:

```
browser_evaluate  script: "document.querySelector('[data-test=\"error-message-container\"]')?.textContent?.trim()"
```

### 5. Read the current URL

```
browser_evaluate  script: "window.location.href"
```

---

## Selector extraction checklist

Before writing a new page object:

1. Navigate to the page
2. Run the `data-test` dump script from step 2 above
3. Map each interactive element to a `getByTestId(...)` call
4. For elements without `data-test`, fall back in order:
   - `getByRole('button', { name: '...' })`
   - `getByLabel('...')`
   - `getByText('...', { exact: true })`
   - CSS selector as last resort (prefix with a comment explaining why)

---

## Assertion text extraction checklist

Before writing an `expect(...).toHaveText(...)` or `expect(...).toContainText(...)`:

1. Reach the state where the element is visible
2. Run `browser_evaluate` with `element.textContent.trim()` to read exact text
3. Use that exact string in the assertion — do not guess from the spec description

---

## MCP caps enabled in this project

The MCP server is started with `--caps=testing`, which enables:

- `browser_navigate`
- `browser_snapshot`
- `browser_click`
- `browser_fill`
- `browser_evaluate`
- `browser_press_key`
- `browser_wait_for`
- `browser_select_option`
- `browser_check` / `browser_uncheck`
- `browser_hover`
- `browser_go_back` / `browser_go_forward`
- `browser_reload`

Output artifacts land in `artifacts/mcp/` (headless mode).

---

## Closing the session

MCP sessions are stateless per-tool-call. No explicit close is needed between explorations.
Each `browser_navigate` starts a fresh context unless a session is explicitly reused.

---

## Translating MCP findings into page object code

After exploration, apply findings as follows:

| MCP finding                      | Page object code                              |
| -------------------------------- | --------------------------------------------- |
| `data-test="username"`           | `page.getByTestId('username')`                |
| `role=button name="Login"`       | `page.getByRole('button', { name: 'Login' })` |
| `label="Password"`               | `page.getByLabel('Password')`                 |
| Exact text `"Epic sadface: ..."` | `expect(el).toHaveText('Epic sadface: ...')`  |
| URL pattern `/inventory.html`    | `expect(page).toHaveURL(/\/inventory\.html/)` |
