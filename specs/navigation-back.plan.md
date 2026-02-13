# Navigation and back button

## Application Overview

Focal Point Editor: upload redirects to `/edit` and the browser back button returns to `/` with the Landing page visible. The app behaves the same whether IndexedDB is available or not.

## Test Scenarios

Each scenario is run **twice**: once with IndexedDB available, once with IndexedDB disabled. Expectations are identical in both runs.

### 1. Navigation and back button

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Upload redirects to /edit, back returns to / with Landing visible

**File:** `e2e/navigation-back.spec.ts`

**Steps (same with or without IndexedDB):**
  1. Visit root path '/'
    - expect: Landing visible
    - expect: Upload button visible
  2. Upload image via Upload button (e2e/fixtures/sample.png)
    - expect: Image appears (FocalPointEditor visible)
    - expect: URL is /edit
  3. Click browser back button
    - expect: URL is /
    - expect: Landing visible
    - expect: Upload button visible
