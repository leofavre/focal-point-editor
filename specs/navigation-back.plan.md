# Navigation and back button (IndexedDB)

## Application Overview

Focal Point Editor uses dynamic persistence based on IndexedDB availability. When IndexedDB is available, upload redirects to `/edit` and the browser back button returns to `/` with the Landing page visible. When IndexedDB is not available, upload stays on `/` and the back button leaves the app (since `/` was the first page loaded).

## Test Scenarios

### 1. Navigation and back button

**Seed:** `e2e/seed.spec.ts`

#### 1.1. IndexedDB available: upload redirects to /edit, back returns to / with Landing visible

**File:** `e2e/navigation-back.spec.ts`

**Steps:**
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

#### 1.2. IndexedDB not available: upload stays on /, back leaves app

**File:** `e2e/navigation-back.spec.ts`

**Steps:**
  1. Disable IndexedDB via addInitScript
  2. Navigate to about:blank (so back has a non-app target)
  3. Navigate to app root '/'
    - expect: Landing visible
  4. Upload image via Upload button
    - expect: Image appears
    - expect: URL remains /
  5. Click browser back button
    - expect: URL is about:blank (previous page, not the app)
