# Editor draggables and generated code

## Overview

After an image is uploaded, the user can change the aspect ratio, toggle Overflow and Focal point, and drag the image, the overflow (overlay) image, or the focal point. The generated code (Code button) must reflect object-position, and the focal point badge (when visible) must reflect the current position. Dragging the image or the overlay must update the focal point position.

## Test scenarios

### 1. Image draggable after upload and aspect-ratio change

**Steps:** Upload image → go to /edit → change aspect ratio (e.g. move slider) → drag inside the editor (image area).

**Expect:** The image moves (object-position updates). No errors; drag is possible.

### 2. Generated code changes when image is dragged

**Steps:** Upload image → /edit → (optional: change aspect ratio) → open Code snippet → note object-position in code → close Code → drag image → open Code again.

**Expect:** The code snippet’s object-position value differs from the value before the drag.

### 3. Overlay (Overflow) on: overlay image is draggable

**Steps:** Upload image → /edit → turn on Overflow → drag inside the editor (overlay area).

**Expect:** The overlay/crop moves (object-position updates). Overlay is draggable.

### 4. Generated code changes when overlay image is dragged

**Steps:** Upload image → /edit → turn on Overflow → open Code → note object-position → close Code → drag overlay → open Code again.

**Expect:** The code snippet’s object-position value differs from the value before the drag.

### 5. Focal point on: focal point can be dragged

**Steps:** Upload image → /edit → turn on Focal point → drag the focal point (cross) to another position.

**Expect:** The focal point moves; object-position updates.

### 6. Generated code changes when focal point is dragged

**Steps:** Upload image → /edit → turn on Focal point → open Code → note object-position → close Code → drag focal point → open Code again.

**Expect:** The code snippet’s object-position value differs from the value before the drag.

### 7. Badge changes when focal point is dragged

**Steps:** Upload image → /edit → turn on Focal point → note focal point badge text (if visible) or code snippet position → drag focal point.

**Expect:** Badge text (when visible) or code snippet object-position reflects the new position.

### 8. Focal point updates when image is dragged

**Steps:** Upload image → /edit → turn on Focal point → note focal point position (badge or code) → drag the image (not the focal point) → note position again.

**Expect:** Focal point position (badge/code) has changed to match the new object-position.

### 9. Focal point updates when overlay image is dragged

**Steps:** Upload image → /edit → turn on Focal point and Overflow → note focal point position → drag the overlay → note position again.

**Expect:** Focal point position has changed to match the new object-position.

## Implementation

**File:** `e2e/editor-draggables-and-code.spec.ts`

- Reuse: `expectLandingVisible`, `expectEditorWithControlsVisible`, `SAMPLE_IMAGE_PATH`, `dragImageInFocalPointEditor` from `e2e/helpers.ts`.
- Helpers to add (in spec or helpers): seed editor (upload + /edit), change aspect ratio, open/close Code and get code snippet object-position text, enable Overflow / Focal point, drag focal point by element, get focal point badge text.
- Selectors: `[data-component="FocalPointEditor"]`, `[data-component="FocalPoint"]`, `[data-component="FocalPointBadge"]` (add to FocalPoint component), `[data-component="CodeSnippet"]` / Code button, Overflow button (name "Overflow"), Focal point button (name "Focal point").
