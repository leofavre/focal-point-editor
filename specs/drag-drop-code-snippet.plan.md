# Drag-drop when code snippet dialog is open

## Overview

When the user has the code snippet dialog open and starts dragging an image file over the page, the code snippet dialog must close first. Only then does the full-screen drop zone overlay appear. The drop must work correctly: the user can drop the file and the image uploads.

## Test scenario

**Steps:**
  1. Seed the editor: upload an image, land on /edit, editor visible.
  2. Open the code snippet dialog (click Code button).
    - expect: Code snippet dialog is visible (`[data-component="CodeSnippet"]`).
  3. Simulate drag start: dispatch `dragenter` (and `dragover`) on document with a file.
    - expect: Code snippet dialog closes (CodeSnippet not visible).
    - expect: Full-screen drop zone overlay appears ("Drop an image here" visible).
  4. Complete the drop: dispatch `dragover` and `drop` on the overlay with the file.
    - expect: Drop succeeds; user stays on /edit; editor with controls remains visible.

## Implementation

**File:** `e2e/drag-drop.spec.ts`

- Reuse: `seedEditorWithImage`, `waitForEditorReady`, `expectEditorWithControlsVisible`, `dropImageFileOnPage` logic (or a variant that starts with dragenter only, then continues with drop).
- The `dropImageFileOnPage` helper can be reused: it dispatches dragenter → waits for overlay → dispatches dragover+drop on overlay. The only addition is the setup: open Code dialog before calling it, and assert Code dialog closes before overlay appears (or assert both: Code gone, overlay visible, then complete drop).
