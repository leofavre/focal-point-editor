# Code snippet copy with object-position

## Application Overview

After uploading an image, the user can change the aspect ratio, move the image (focal point) inside the container, then open the code snippet and copy it. The clipboard must contain the snippet with the correct object-position value. We verify this in two environments: with the Clipboard API available (navigator.clipboard.writeText) and with it unavailable (fallback path using execCommand).

## Test Scenarios

### 1. Code snippet copy with object-position

**Seed:** `e2e/code-snippet-copy.seed.spec.ts`

#### 1.1. copies code snippet with correct object-position when Clipboard API is available

**File:** `e2e/code-snippet-copy-clipboard-api.spec.ts`

**Steps:**
  1. Ensure editor is loaded with an image (from seed: upload image and land on /edit).
    - expect: URL is /edit
    - expect: FocalPointEditor and controls (AspectRatioSlider, Code snippet button) are visible.
  2. Change the aspect ratio using the aspect-ratio slider (e.g. select a different preset or move the slider).
    - expect: The crop container updates to the new aspect ratio.
  3. Drag the image inside the container to move the focal point (e.g. drag to top-left or a specific position).
    - expect: The visible crop updates; object-position state changes.
  4. Click the Code snippet toggle button to open the code snippet dialog.
    - expect: Code snippet dialog opens with snippet content containing object-position.
  5. Click the Copy button in the code snippet dialog.
    - expect: Copy button shows feedback (e.g. Copied!).
  6. Read the clipboard content (e.g. via page.evaluate(() => navigator.clipboard.readText()) or granted clipboard read).
    - expect: Clipboard text contains the same object-position value that matches the current focal point (e.g. object-position: X% Y% or objectPosition in the snippet).

#### 1.2. copies code snippet with correct object-position when Clipboard API is unavailable

**File:** `e2e/code-snippet-copy-fallback.spec.ts`

**Steps:**
  1. Create a browser context or page where navigator.clipboard is undefined or writeText is not available (e.g. addInitScript to stub navigator.clipboard before navigation).
    - expect: Page loads with Clipboard API unavailable.
  2. Navigate to / and upload an image (same as seed); wait for editor on /edit.
    - expect: Editor with image and controls is visible.
  3. Change the aspect ratio using the aspect-ratio slider.
    - expect: Crop container aspect ratio updates.
  4. Drag the image inside the container to move the focal point.
    - expect: Focal position updates.
  5. Open the code snippet dialog and click Copy.
    - expect: Copy uses fallback path; Copy button shows Copied! or similar.
  6. Read clipboard (fallback still writes to system clipboard; use clipboard read permission or page.evaluate if test environment exposes it).
    - expect: Clipboard text contains the code snippet with the correct object-position value matching the current focal point.
