# Landing page spec

## Application Overview

Focal Point Editor is a web app for cropping images in responsive layouts using a focal point. The root path (/) shows a landing view where the user can read the project description and start by using an upload button.

## Test Scenarios

### 1. Landing page

**File:** `e2e/landing.spec.ts`

**Steps:**
  1. Visit the root path '/'
    - expect: The project description section is visible (target by structure or test id, not by exact copy, so the wording can change).
    - expect: An upload button is visible.

### 2. Landing page with IndexedDB disabled

**File:** `e2e/landing.spec.ts`

Same assertions as the first test, but with IndexedDB turned off so the app runs in ephemeral (no persistence) mode. IndexedDB is disabled in the test by injecting a script before the page loads (e.g. Playwright `addInitScript` that stubs `window.indexedDB` to undefined).

**Steps:**
  1. Disable IndexedDB for the page (e.g. via addInitScript stubbing `window.indexedDB`).
  2. Visit the root path '/'
    - expect: The project description section is visible (target by structure or test id, not by exact copy, so the wording can change).
    - expect: An upload button is visible.
