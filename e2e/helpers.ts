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
