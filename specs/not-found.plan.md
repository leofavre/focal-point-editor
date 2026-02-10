# Not-found and image-not-found page states

## Application Overview

Focal Point Editor shows different messages depending on the URL and IndexedDB state (with an empty database):

- **Page not found**: Invalid or unknown path (e.g. `/bogus`) or, when IndexedDB is off, any path with an `imageId` (e.g. `/edit`) — shows "Page not found...".
- **Image not found**: When IndexedDB is on and the URL is the single-image editor path (`/edit`) but the database has no image — shows "Start by uploading an image..." or "Image not found...".

All tests assume the database is **empty** at the start of each test. For tests with IndexedDB on, a **fresh browser context** is used so IndexedDB is empty (no prior app data). For tests with IndexedDB off, the app does not use the database.

## Test Scenarios

### 1. Invalid URL (/bogus)

**Seed:** `e2e/seed.spec.ts`

#### 1.1. /bogus with IndexedDB off shows page not found

**File:** `e2e/not-found.spec.ts`

**Steps:**
  1. Reset database (ensure empty) — for IDB-off tests no DB is used
  2. Disable IndexedDB via addInitScript
  3. Visit '/bogus'
  4. Expect: "Page not found..." (or equivalent) visible

#### 1.2. /bogus with IndexedDB on (empty DB) shows page not found

**File:** `e2e/not-found.spec.ts`

**Steps:**
  1. Reset database (clear IndexedDB so it is empty)
  2. Visit '/bogus'
  3. Expect: "Page not found..." (or equivalent) visible

### 2. Editor URL with no image (/edit)

#### 2.1. /edit with IndexedDB off shows page not found

**File:** `e2e/not-found.spec.ts`

**Steps:**
  1. Disable IndexedDB via addInitScript
  2. Visit '/edit'
  3. Expect: "Page not found..." (or equivalent) visible

#### 2.2. /edit with IndexedDB on (empty DB) shows image not found

**File:** `e2e/not-found.spec.ts`

**Steps:**
  1. Reset database (clear IndexedDB so it is empty)
  2. Visit '/edit'
  3. Expect: "Image not found" or "Start by uploading an image..." (or equivalent) visible — not "Page not found"
