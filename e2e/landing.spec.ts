import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("shows project description and upload button when visiting /", async ({ page }) => {
    await page.goto("/");

    // Wait for landing: description section (stable selector; copy may change)
    const landing = page.locator('[data-component="Landing"]');
    await expect(landing.locator('[data-component="HowToUse"]')).toBeVisible();

    await expect(landing.getByRole("button", { name: "Upload" })).toBeVisible();
  });

  test("shows project description and upload button when visiting / with IndexedDB disabled", async ({
    page,
  }) => {
    await page.addInitScript(() => {
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
    await page.goto("/");

    const landing = page.locator('[data-component="Landing"]');
    await expect(landing.locator('[data-component="HowToUse"]')).toBeVisible();
    await expect(landing.getByRole("button", { name: "Upload" })).toBeVisible();
  });
});
