# Drag-and-drop image upload

## Application Overview

Focal Point Editor uses react-dropzone; full-screen overlay when dragging. Drop image on page → upload and redirect to /edit (same behavior whether IndexedDB is available or not). Drop outside → no redirect, app responsive, no persistent overlay.

## Test Scenarios

Each scenario is run **twice**: once with IndexedDB available, once with IndexedDB disabled. Expectations are identical in both runs.

### 1. Drag-drop

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Drop file on app then image uploaded and redirect to /edit

**File:** `e2e/drag-drop.spec.ts`

**Steps (same with or without IndexedDB):**
  1. Visit root path '/'
    - expect: Landing visible
  2. Simulate file drop (dispatchEvent dragenter, dragover, drop) with test image
    - expect: Image uploaded
    - expect: App redirects to /edit
    - expect: Editor view visible

#### 1.2. File dragged but dropped outside browser then app stays responsive and no redirect

**File:** `e2e/drag-drop.spec.ts`

**Steps (same with or without IndexedDB):**
  1. Visit root path '/'
    - expect: Landing visible
  2. Dispatch dragenter, dragover, dragleave (no drop)
    - expect: URL remains /
    - expect: No persistent overlay
    - expect: Upload button visible and interactive
