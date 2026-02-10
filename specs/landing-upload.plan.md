# Landing page image upload

## Application Overview

Focal Point Editor landing page: when user uploads an image, with IndexedDB the app redirects to /edit and shows the editor; without IndexedDB the URL stays / but the same editor UI (image + controls) is shown.

## Test Scenarios

### 1. Landing upload

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Image upload with IndexedDB available redirects to /edit and shows editor

**File:** `e2e/landing-upload.spec.ts`

**Steps:**
  1. Visit root path '/'
    - expect: Landing is visible (Upload button / data-component Landing)
  2. Click Upload and provide a test image file via file chooser
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
    - expect: Landing is visible
  3. Click Upload and provide test image file
    - expect: URL remains /
    - expect: Editor view shows image
  4. Verify editor controls
    - expect: Aspect ratio slider visible
    - expect: Control buttons visible
