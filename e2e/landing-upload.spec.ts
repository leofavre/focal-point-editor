import { test, expect } from "@playwright/test";
import {
  SAMPLE_IMAGE_PATH,
  expectEditorWithControlsVisible,
  expectLandingVisible,
} from "./helpers";
import { test as testWithFixtures } from "./fixtures";

test.describe("Landing upload", () => {
  test("with IndexedDB: image upload redirects to /edit and shows editor", async ({
    page,
  }) => {
    await page.goto("/");
    await expectLandingVisible(page);

    const landing = page.locator('[data-component="Landing"]');
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      landing.getByRole("button", { name: "Upload" }).click(),
    ]);
    await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

    await expect(page).toHaveURL(/\/edit$/);
    await expectEditorWithControlsVisible(page);
  });

  testWithFixtures(
    "without IndexedDB: image upload redirects to /edit and shows editor",
    async ({ pageWithoutIndexedDB: page }) => {
      await page.goto("/");
      await expectLandingVisible(page);

      const landing = page.locator('[data-component="Landing"]');
      const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        landing.getByRole("button", { name: "Upload" }).click(),
      ]);
      await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

      await expect(page).toHaveURL(/\/edit$/);
      await expectEditorWithControlsVisible(page);
    },
  );

  test("with IndexedDB: user starts upload via button then cancels file dialog – UI responsive and button not pressed", async ({
    page,
  }) => {
    await page.goto("/");
    const landing = page.locator('[data-component="Landing"]');
    await expectLandingVisible(page);
    const uploadButton = landing.getByRole("button", { name: "Upload" });

    const fileChooserPromise = page.waitForEvent("filechooser");
    await uploadButton.click();
    await fileChooserPromise;
    await page.evaluate(() => window.dispatchEvent(new Event("focus")));

    await expect(page).toHaveURL("/");
    await expect(landing).toBeVisible();
    await expect(uploadButton).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator('[data-component="FocalPointEditor"]')).not.toBeVisible();
  });

  testWithFixtures(
    "without IndexedDB: user starts upload via button then cancels file dialog – UI responsive and button not pressed",
    async ({ pageWithoutIndexedDB: page }) => {
      await page.goto("/");
      const landing = page.locator('[data-component="Landing"]');
      await expectLandingVisible(page);
      const uploadButton = landing.getByRole("button", { name: "Upload" });

      const fileChooserPromise = page.waitForEvent("filechooser");
      await uploadButton.click();
      await fileChooserPromise;
      await page.evaluate(() => window.dispatchEvent(new Event("focus")));

      await expect(page).toHaveURL("/");
      await expect(landing).toBeVisible();
      await expect(uploadButton).toHaveAttribute("aria-pressed", "false");
      await expect(page.locator('[data-component="FocalPointEditor"]')).not.toBeVisible();
    },
  );
});
