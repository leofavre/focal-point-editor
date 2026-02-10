import { test, expect } from "@playwright/test";
import {
  SAMPLE_IMAGE_PATH,
  expectEditorWithControlsVisible,
  expectLandingVisible,
} from "./helpers";
import { test as testWithFixtures } from "./fixtures";

test.describe("Navigation and back button", () => {
  test("IndexedDB available: upload redirects to /edit, back returns to / with Landing visible", async ({
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

    await page.goBack();

    await expect(page).toHaveURL("/");
    await expectLandingVisible(page);
  });

  testWithFixtures(
    "IndexedDB not available: upload stays on /, back leaves app",
    async ({ pageWithoutIndexedDB: page }) => {
      await page.goto("about:blank");
      await page.goto("/");
      await expectLandingVisible(page);

      const landing = page.locator('[data-component="Landing"]');
      const [fileChooser] = await Promise.all([
        page.waitForEvent("filechooser"),
        landing.getByRole("button", { name: "Upload" }).click(),
      ]);
      await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

      await expect(page).toHaveURL(/\/$/);
      await expectEditorWithControlsVisible(page);

      await page.goBack();
      await expect(page).toHaveURL("about:blank");
    },
  );
});
