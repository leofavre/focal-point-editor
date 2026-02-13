# Bottom bar keyboard navigation

> **Memo:** Always use Playwright dedicated models (Planner, Generator, Healer) when planning, adding, and reviewing e2e / integration tests.

## Application Overview

After the user uploads an image, the editor shows a bottom bar with five controls: Focal point, Overflow, Aspect ratio slider, Code, and Upload. Tab key must move focus between them in visual order. When the aspect ratio slider is focused, Arrow Left and Arrow Right must move between common aspect ratios (from left end to right end and back).

## Test Scenarios

### 1. Bottom bar keyboard navigation

**Seed:** `e2e/seed.spec.ts`

#### 1.1. bottom bar is visible when editor is shown

**File:** `e2e/bottom-bar-keyboard.spec.ts`

**Steps:**
  1. Go to / and upload sample image via Upload button
    - expect: Redirect to /edit
    - expect: Editor and controls visible
  2. Assert main has data-has-bottom-bar and bottom bar controls are visible
    - expect: Layout grid has data-has-bottom-bar
    - expect: FocalPointButton, AspectRatioSlider, Upload button visible in bar

#### 1.2. Tab moves focus through bottom bar controls in visual order

**File:** `e2e/bottom-bar-keyboard.spec.ts`

**Steps:**
  1. Go to / and upload sample image
    - expect: Editor with bottom bar visible
  2. Focus Focal point button
    - expect: Focal point button is focused
  3. Press Tab four times
    - expect: Focus moves to Overflow, then Aspect ratio slider, then Code, then Upload

#### 1.3. Shift+Tab moves focus backward through bottom bar controls

**File:** `e2e/bottom-bar-keyboard.spec.ts`

**Steps:**
  1. Go to / and upload sample image
    - expect: Editor with bottom bar visible
  2. Focus Upload button
    - expect: Upload button is focused
  3. Press Shift+Tab four times
    - expect: Focus moves to Code, then Aspect ratio slider, then Overflow, then Focal point

#### 1.4. when slider is focused, Arrow Left/Right navigate between aspect ratios

**File:** `e2e/bottom-bar-keyboard.spec.ts`

**Steps:**
  1. Go to / and upload sample image
    - expect: Editor with bottom bar visible
  2. Focus the aspect ratio slider
    - expect: Slider is focused
  3. Press ArrowLeft repeatedly until slider value stops changing (reach left end)
    - expect: Slider value stabilizes at left end
  4. Press ArrowRight once
    - expect: Slider value changes (next aspect ratio)
  5. Press ArrowLeft once
    - expect: Slider value changes (previous aspect ratio)

#### 1.5. when slider is focused, Arrow Right to right end then Arrow Left navigates back

**File:** `e2e/bottom-bar-keyboard.spec.ts`

**Steps:**
  1. Go to / and upload sample image
    - expect: Editor with bottom bar visible
  2. Focus the aspect ratio slider
    - expect: Slider is focused
  3. Press ArrowRight repeatedly until slider value stops changing (reach right end)
    - expect: Slider value stabilizes at right end
  4. Press ArrowLeft once
    - expect: Slider value changes (previous aspect ratio)
