# Keyboard shortcuts

> **Memo:** Always use Playwright dedicated models (Planner, Generator, Healer) when planning, adding, and reviewing e2e / integration tests.

## Application Overview

Editor keyboard shortcuts: e (focus image), a (focal point toggle), s (overflow toggle), d (focus slider), f (open code), g/u/i (upload), c (copy code directly). Shortcuts are case-insensitive. Control+key or Command+key must not trigger (default browser behavior). Shift+key must trigger the shortcut. Control+C must copy selected text and must not trigger the shortcut.

## Test Scenarios

### 1. Keyboard shortcuts

**Seed:** `e2e/seed.spec.ts`

#### 1.1. u, g, i open file chooser for upload

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Go to / and upload sample image to reach editor
    - expect: Editor with bottom bar visible
  2. Press key 'u', 'g', or 'i'
    - expect: File chooser opens (upload triggered)

#### 1.2. e focuses the image

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor with image
    - expect: Image visible
  2. Press 'e'
    - expect: Image (role="img") receives focus

#### 1.3. a toggles focal point (aria-pressed changes)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor with image
    - expect: Focal point button visible
  2. Press 'a' and check focal point button aria-pressed
    - expect: aria-pressed toggles

#### 1.4. s toggles image overflow (aria-pressed changes)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Overflow button visible
  2. Press 's' and assert Overflow button aria-pressed toggles
    - expect: aria-pressed toggles

#### 1.5. d focuses the aspect ratio slider

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Slider visible
  2. Press 'd'
    - expect: Aspect ratio slider receives focus

#### 1.6. f opens the code snippet (does not toggle)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Code button visible
  2. Press 'f'
    - expect: Code snippet dialog opens
  3. Press 'f' again
    - expect: Code snippet stays open (does not toggle closed)

#### 1.7. g, u, i open file chooser for upload

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
  2. Press 'g', 'u', or 'i'
    - expect: File chooser opens

#### 1.8. c copies code snippet directly without opening dialog

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
  2. Press 'c'
    - expect: Code copied to clipboard (toast visible, clipboard contains object-fit)
    - expect: Code snippet dialog does NOT open

#### 1.9. Control+key does not trigger shortcut (e.g. Control+u no file chooser)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Ready
  2. Press Control+u and wait short time
    - expect: File chooser does NOT open

#### 1.10. Shift+key triggers shortcut (e.g. Shift+U opens file chooser)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Ready
  2. Press Shift+U
    - expect: File chooser opens

#### 1.11. Shift+key triggers shortcut for toggle (e.g. Shift+A toggles focal point)

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor
    - expect: Focal point button visible
  2. Press Shift+A
    - expect: Focal point button aria-pressed toggles

#### 1.12. Control+C copies selected text and does not trigger shortcut

**File:** `e2e/keyboard-shortcuts.spec.ts`

**Steps:**
  1. Reach editor, press 'f' to open code snippet
    - expect: Code snippet visible
  2. Select code snippet text (Selection API)
    - expect: Text selected
  3. Press Control+C
    - expect: Code snippet stays open (shortcut did not fire)
    - expect: Selected text is copied to clipboard (contains object-fit)
