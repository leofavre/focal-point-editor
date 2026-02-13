# Playwright Test Agents (Option 2)

This project uses [Playwright Test Agents](https://playwright.dev/docs/test-agents): **Planner**, **Generator**, and **Healer**. They work with an AI assistant (e.g. in Cursor/VS Code) to create and maintain E2E tests from natural language.

> **Memo:** Always use Playwright dedicated models (Planner, Generator, Healer) when planning, adding, and reviewing e2e / integration tests.

## Setup

- **Playwright** and browsers: run `yarn playwright install` (or `npx playwright install`) if you see an "Executable doesn't exist" error.
- The app is started automatically on port 5173 when running tests (`yarn test:e2e`). If that port is already in use, either stop the other process or rely on `reuseExistingServer` (used when `CI` is not set).
- **MCP (Cursor)**: Playwright tools are exposed via the `playwright-test` MCP server. This project configures it in **`.cursor/mcp.json`** so Cursor loads it for this repo. Check **Cursor Settings → Features → MCP** and ensure the `playwright-test` server is present and enabled (you may need to reload or reopen the project).
- **Agent definitions** in `.github/agents/` describe Planner/Generator/Healer behavior; they are used by the AI when it calls the MCP tools. In Cursor there is **no separate “Playwright agent” to select** from a list — you use Composer (Agent) and prompt in natural language; the model will use the Playwright tools if the MCP server is connected.
- **Seed test**: `e2e/seed.spec.ts` — run once to bootstrap the environment; the Planner and Generator use it as a template.
- **Specs**: `specs/` — human-readable Markdown test plans produced by the Planner.

## Using in Cursor (no agent dropdown)

You do **not** need to select a “Playwright agent” in Cursor. There is no dedicated Playwright entry in the agent list. Instead:

1. **Enable the Playwright MCP server**  
   This repo has **`.cursor/mcp.json`** with the `playwright-test` server. Cursor should load it for this project. If you don’t see it: **Cursor Settings → Features → MCP** and add a server with command `npx`, args `["playwright", "run-test-mcp-server"]`, or confirm the project’s `.cursor/mcp.json` is being used (sometimes a reload/reopen is needed).

2. **Use Composer (Agent)**  
   MCP tools are available in **Composer / Agent mode**, not in simple chat. Open Composer and run your request there.

3. **Prompt in natural language**  
   Ask for a test plan or for generated tests (see “Writing tests in natural language” below). The AI will use the Playwright MCP tools (e.g. `planner_setup_page`, `planner_save_plan`, `generator_write_test`) when they’re available — no need to pick an agent by name.

## How to use

1. **Run the seed test** (so the app and config are valid):
   ```bash
   yarn test:e2e
   ```

2. **Planner** — Ask your AI assistant to create a test plan, e.g.:
   - “Generate a test plan for the Focal Point Editor: loading the app, uploading an image, and adjusting the focal point.”
   - The assistant will use the Planner agent, explore the app, and save a plan under `specs/` (e.g. `specs/basic-operations.md`).

3. **Generator** — Ask the AI to turn a plan into tests:
   - “Generate Playwright tests from `specs/basic-operations.md` using the seed in `e2e/seed.spec.ts`.”
   - The assistant will use the Generator agent and add test files under `e2e/`.

4. **Healer** — When a test fails, ask the AI to fix it:
   - “Heal the failing test `e2e/some-test.spec.ts`.”
   - The Healer agent will analyze the failure and suggest (or apply) fixes.

---

## Writing tests in natural language (two steps)

Natural language is turned into Playwright code in **two steps**: first a **test plan** (Markdown), then **generated tests** (TypeScript).

### Step 1: Describe the scenario → get a test plan

In Cursor (or your AI with Playwright MCP), ask for a **test plan** in plain language. The **Planner** agent will explore your app and write a Markdown spec into `specs/`.

**Example prompts:**

- *"Create a test plan for the Focal Point Editor: open the app, then upload an image and move the focal point."*
- *"Generate a test plan that covers: landing page loads, user can paste an image URL, and the aspect ratio slider works."*
- *"Write a test plan for the editor: drag-and-drop an image, toggle the focal point visibility, and copy the code snippet."*

The AI will use the Planner (and tools like `planner_setup_page`, `browser_snapshot`, `browser_click`, etc.), then save a plan with **planner_save_plan** to a file such as `specs/basic-operations.md` or `specs/editor-flows.md`. That file has structured scenarios: titles, steps, and expected results.

### Step 2: Turn the plan into Playwright code

Once you have a spec file in `specs/`, ask the AI to **generate tests** from it. The **Generator** agent will run the steps in a real browser and emit Playwright test files.

**Example prompts:**

- *"Generate Playwright tests from `specs/basic-operations.md` using the seed in `e2e/seed.spec.ts`."*
- *"Convert the test plan in `specs/editor-flows.md` into Playwright tests; seed file is `e2e/seed.spec.ts`."*

The Generator uses `generator_setup_page`, runs each step with browser tools, then calls `generator_write_test` to write `.spec.ts` files under `e2e/`. You can run them with `yarn test:e2e`.

**Summary:** Natural language → **Planner** → `specs/*.md` → **Generator** → `e2e/*.spec.ts` → `yarn test:e2e`.

## Shared helpers and fixtures

E2E tests share logic via **helpers** and **fixtures** so we consistently test both “IndexedDB available” and “IndexedDB unavailable” without duplicating code.

- **`e2e/helpers.ts`** — Shared helpers:
  - `SAMPLE_IMAGE_PATH` — path to the test image
  - `disableIndexedDB(page)` — disables IndexedDB for a page (call before any navigation)
  - `disableIndexedDBOnContext(context)` — disables IndexedDB for a context (for use when creating contexts)
  - `expectEditorWithControlsVisible(page)` — asserts editor + all controls are visible
  - `expectLandingVisible(page)` — asserts Landing page and Upload button are visible

- **`e2e/fixtures.ts`** — Extended test with a **IndexedDB-unavailable** scenario:
  - Import `test as testWithFixtures` and `expect` from `./fixtures` (or keep `expect` from `@playwright/test`).
  - Use the **`pageWithoutIndexedDB`** fixture for tests that must run with IndexedDB disabled. The fixture provides a page whose context already has IndexedDB disabled (no need to call `disableIndexedDB` or `addInitScript` before `goto`).

**Pattern:** For “IndexedDB available” use the default `test` and `page`. For “IndexedDB unavailable” use `testWithFixtures` and request `pageWithoutIndexedDB`. Playwright isolates storage (including IndexedDB) per test, so the default `page` already has an empty DB.

## Commands

| Command            | Description                  |
|--------------------|------------------------------|
| `yarn test:e2e`    | Run all Playwright E2E tests |
| `yarn test:e2e:ui` | Run tests with Playwright UI |

## Regenerating agent definitions

After upgrading Playwright, regenerate the agent definitions:

```bash
npx playwright init-agents --loop=vscode
```
