import { test, expect } from "@playwright/test";

/**
 * Uses a fresh browser context so IndexedDB is empty (no prior app data).
 * Use this for tests that require an empty database with IndexedDB on.
 */
async function withEmptyDB(
  browser: import("@playwright/test").Browser,
  baseURL: string | undefined,
  fn: (page: import("@playwright/test").Page) => Promise<void>,
) {
  const context = await browser.newContext({
    baseURL: baseURL ?? "http://localhost:5173",
  });
  try {
    const page = await context.newPage();
    await fn(page);
  } finally {
    await context.close();
  }
}

function disableIndexedDB(page: import("@playwright/test").Page) {
  return page.addInitScript(() => {
    try {
      Object.defineProperty(window, "indexedDB", {
        get: () => undefined,
        configurable: true,
        enumerable: true,
      });
    } catch {
      // ignore if not configurable
    }
  });
}

test.describe("Not-found and image-not-found", () => {
  test("/bogus with IndexedDB off shows page not found", async ({ page }) => {
    await disableIndexedDB(page);
    await page.goto("/bogus");

    await expect(page.getByText("Page not found...")).toBeVisible();
  });

  test("/bogus with IndexedDB on (empty DB) shows page not found", async ({
    browser,
    baseURL,
  }) => {
    await withEmptyDB(browser, baseURL, async (p) => {
      await p.goto("/bogus");
      await expect(p.getByText("Page not found...")).toBeVisible();
    });
  });

  test("/edit with IndexedDB off shows page not found", async ({ page }) => {
    await disableIndexedDB(page);
    await page.goto("/edit");

    await expect(page.getByText("Page not found...")).toBeVisible();
  });

  test("/edit with IndexedDB on (empty DB) shows image not found", async ({
    browser,
    baseURL,
  }) => {
    await withEmptyDB(browser, baseURL, async (p) => {
      await p.goto("/edit");
      await expect(
        p.getByText(/Start by uploading an image\.\.\.|Image not found\.\.\./),
      ).toBeVisible();
      await expect(p.getByText("Page not found...")).not.toBeVisible();
    });
  });
});
