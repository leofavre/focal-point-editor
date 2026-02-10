# Landing page image upload

## Application Overview

Focal Point Editor landing page: upload image via button (with/without IndexedDB, redirect vs stay on /). Cancel flow: open file dialog then cancel → UI responsive, button aria-pressed false, no upload.

## Test Scenarios

### 1. Landing upload

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Image upload with IndexedDB available redirects to /edit and shows editor

**File:** `e2e/landing-upload.spec.ts`

**Steps:**
  1. Visit root path '/'
    - expect: Landing visible (Upload button, data-component Landing)
  2. Click Upload and provide test image via file chooser
    - expect: App redirects to /edit
    - expect: Editor view shows image
  3. Verify editor controls
    - expect: Aspect ratio slider visible
    - expect: Control buttons (Focal point, Overflow, Code, Upload) visible

#### 1.2. Image upload with IndexedDB disabled stays on / and shows editor

**File:** `e2e/landing-upload.spec.ts`

**Steps:**
  1. Disable IndexedDB via addInitScript
  2. Visit root path '/'
    - expect: Landing visible
  3. Click Upload and provide test image file
    - expect: URL remains /
    - expect: Editor view shows image
  4. Verify editor controls
    - expect: Aspect ratio slider visible
    - expect: Control buttons visible

#### 1.3. User starts upload via button then cancels file dialog – UI responsive and button not pressed

**File:** `e2e/landing-upload.spec.ts`

**Steps:**
  1. Visit root path '/'
    - expect: Landing visible
  2. Click Upload to open file chooser then cancel (Escape)
    - expect: No upload
    - expect: Still on landing
    - expect: Upload button aria-pressed false

#### 1.4. IndexedDB disabled: user starts upload via button then cancels – UI responsive and button not pressed

**File:** `e2e/landing-upload.spec.ts`

**Steps:**
  1. Disable IndexedDB via addInitScript
  2. Visit root path '/'
    - expect: Landing visible
  3. Click Upload then cancel file dialog
    - expect: No upload
    - expect: Upload button aria-pressed false
