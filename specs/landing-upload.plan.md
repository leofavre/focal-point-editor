# Landing page image upload

## Application Overview

Focal Point Editor landing page: upload image via button redirects to /edit and shows the editor (same behavior whether IndexedDB is available or not). Cancel flow: open file dialog then cancel → UI responsive, button aria-pressed false, no upload.

## Test Scenarios

Each scenario is run **twice**: once with IndexedDB available, once with IndexedDB disabled. Expectations are identical in both runs.

### 1. Landing upload

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Image upload redirects to /edit and shows editor

**File:** `e2e/landing-upload.spec.ts`

**Steps (same with or without IndexedDB):**
  1. Visit root path '/'
    - expect: Landing visible (Upload button, data-component Landing)
  2. Click Upload and provide test image via file chooser
    - expect: App redirects to /edit
    - expect: Editor view shows image
  3. Verify editor controls
    - expect: Aspect ratio slider visible
    - expect: Control buttons (Focal point, Overflow, Code, Upload) visible

#### 1.2. User starts upload via button then cancels file dialog – UI responsive and button not pressed

**File:** `e2e/landing-upload.spec.ts`

**Steps (same with or without IndexedDB):**
  1. Visit root path '/'
    - expect: Landing visible
  2. Click Upload to open file chooser then cancel (Escape)
    - expect: No upload
    - expect: Still on landing
    - expect: Upload button aria-pressed false
