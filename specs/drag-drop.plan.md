# Drag-and-drop image upload

## Application Overview

Focal Point Editor uses react-dropzone; full-screen overlay when dragging. Drop image on page → upload (IndexedDB: redirect to /edit; no IndexedDB: stay on /). Drop outside → no redirect, app responsive, no persistent overlay.

## Test Scenarios

### 1. Drag-drop

**Seed:** `e2e/seed.spec.ts`

#### 1.1. Drop file on app then image uploaded and redirect to /edit

**File:** `e2e/drag-drop.spec.ts`

**Steps:**
  1. Visit root path '/'
    - expect: Landing visible
  2. Simulate file drop (dispatchEvent dragenter, dragover, drop) with test image
    - expect: Image uploaded
    - expect: App redirects to /edit
    - expect: Editor view visible

#### 1.2. IndexedDB disabled: drop file on app then image uploaded and no redirect

**File:** `e2e/drag-drop.spec.ts`

**Steps:**
  1. Disable IndexedDB via addInitScript
  2. Visit root path '/'
    - expect: Landing visible
  3. Simulate file drop on page
    - expect: Image uploaded
    - expect: URL remains /
    - expect: Editor view visible

#### 1.3. File dragged but dropped outside browser then app stays responsive and no redirect

**File:** `e2e/drag-drop.spec.ts`

**Steps:**
  1. Visit root path '/'
    - expect: Landing visible
  2. Dispatch dragenter, dragover, dragleave (no drop)
    - expect: URL remains /
    - expect: No persistent overlay
    - expect: Upload button visible and interactive

#### 1.4. IndexedDB disabled: file dragged but dropped outside then app stays responsive and no redirect

**File:** `e2e/drag-drop.spec.ts`

**Steps:**
  1. Disable IndexedDB via addInitScript
  2. Visit root path '/'
    - expect: Landing visible
  3. Drag then drop outside (dragleave, no drop)
    - expect: No redirect
    - expect: App responsive
    - expect: Landing UI visible and interactive
