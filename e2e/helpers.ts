import path from "node:path";
import type { BrowserContext, Page } from "@playwright/test";
import { expect } from "@playwright/test";

const INDEXED_DB_DISABLE_SCRIPT = () => {
  try {
    Object.defineProperty(window, "indexedDB", {
      get: () => undefined,
      configurable: true,
      enumerable: true,
    });
  } catch {
    // ignore if not configurable
  }
};

export const SAMPLE_IMAGE_PATH = path.join(process.cwd(), "e2e", "fixtures", "sample.png");

/**
 * Disables IndexedDB for the given page by defining `window.indexedDB` as undefined.
 * Must be called before any navigation (e.g. before `page.goto()`).
 */
export function disableIndexedDB(page: Page): Promise<void> {
  return page.addInitScript(INDEXED_DB_DISABLE_SCRIPT);
}

/**
 * Disables IndexedDB for the given context (applies to all pages created from it).
 * Use when creating a context for "IndexedDB unavailable" scenarios.
 */
export function disableIndexedDBOnContext(context: BrowserContext): Promise<void> {
  return context.addInitScript(INDEXED_DB_DISABLE_SCRIPT);
}

const CLIPBOARD_WRITE_DISABLE_SCRIPT = () => {
  try {
    const original = navigator.clipboard;
    if (!original) return;
    Object.defineProperty(navigator, "clipboard", {
      value: {
        readText: () => original.readText(),
        writeText: () => Promise.reject(new Error("clipboard.writeText disabled for test")),
        read: original.read?.bind(original),
        write: original.write?.bind(original),
      },
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    // ignore if not configurable
  }
};

/**
 * Makes navigator.clipboard.writeText reject so the app uses the copy fallback (execCommand).
 * readText is left working so the test can still verify clipboard content.
 * Must be applied before any navigation (e.g. via context.addInitScript when creating the context).
 */
export function disableClipboardWriteOnContext(context: BrowserContext): Promise<void> {
  return context.addInitScript(CLIPBOARD_WRITE_DISABLE_SCRIPT);
}

/**
 * Asserts that the editor view and all controls are visible (FocalPointEditor,
 * AspectRatioSlider, Focal point / Overflow / Code toggles, Upload button).
 */
export function expectEditorWithControlsVisible(page: Page) {
  const focalPointEditor = page.locator('[data-component="FocalPointEditor"]');
  const aspectRatioSlider = page.locator('[data-component="AspectRatioSlider"]');
  const focalPointButton = page.locator('[data-component="FocalPointButton"]');
  const imageOverflowButton = page.locator('[data-component="ImageOverflowButton"]');
  const codeSnippetButton = page.locator('[data-component="CodeSnippetButton"]');
  const uploadButton = page.getByRole("button", { name: "Upload", exact: true });

  return Promise.all([
    expect(focalPointEditor).toBeVisible(),
    expect(aspectRatioSlider).toBeVisible(),
    expect(focalPointButton).toBeVisible(),
    expect(imageOverflowButton).toBeVisible(),
    expect(codeSnippetButton).toBeVisible(),
    expect(uploadButton).toBeVisible(),
  ]);
}

/**
 * Asserts that the Landing page is visible and the Upload button is visible.
 */
export async function expectLandingVisible(page: Page) {
  const landing = page.locator('[data-component="Landing"]');
  await expect(landing).toBeVisible();
  await expect(landing.getByRole("button", { name: "Upload image", exact: true })).toBeVisible();
}

/**
 * Options for dragging the image inside the focal point editor.
 * Values are ratios of the editor size (0–1). Default: from center (0.5, 0.5) to top-left quarter (0.25, 0.25).
 */
export type DragImageInEditorOptions = {
  from?: { x: number; y: number };
  to?: { x: number; y: number };
  steps?: number;
};

/**
 * Drags the image inside the focal point editor to move the focal point (object-position).
 * Use after the editor is visible on /edit. Simulates pointer move → down → move → up.
 */
export async function dragImageInFocalPointEditor(
  page: Page,
  options: DragImageInEditorOptions = {},
): Promise<void> {
  const { from = { x: 0.5, y: 0.5 }, to = { x: 0.25, y: 0.25 }, steps = 5 } = options;
  const focalPointEditor = page.locator('[data-component="FocalPointEditor"]');
  const editorBox = await focalPointEditor.boundingBox();
  if (editorBox == null) return;
  const fromX = editorBox.x + editorBox.width * from.x;
  const fromY = editorBox.y + editorBox.height * from.y;
  const toX = editorBox.x + editorBox.width * to.x;
  const toY = editorBox.y + editorBox.height * to.y;
  await page.mouse.move(fromX, fromY);
  await page.mouse.down();
  await page.mouse.move(toX, toY, { steps });
  await page.mouse.up();
}
