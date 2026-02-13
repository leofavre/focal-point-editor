import { expect, test } from "@playwright/test";
import { test as testWithFixtures } from "./fixtures";
import {
  expectEditorWithControlsVisible,
  expectLandingVisible,
  SAMPLE_IMAGE_PATH,
} from "./helpers";

test.describe("Navigation and back button", () => {
  test("with IndexedDB: upload redirects to /edit, back returns to / with Landing visible", async ({
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
    "without IndexedDB: upload redirects to /edit, back returns to / with Landing visible",
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

      await expect(page).toHaveURL(/\/edit$/);
      await expectEditorWithControlsVisible(page);

      await page.goBack();

      await expect(page).toHaveURL("/");
      await expectLandingVisible(page);
    },
  );
});
