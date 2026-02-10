import path from "node:path";
import { test, expect } from "@playwright/test";

const SAMPLE_IMAGE_PATH = path.join(process.cwd(), "e2e", "fixtures", "sample.png");

function expectEditorWithControlsVisible(page: import("@playwright/test").Page) {
  // Editor view: FocalPointEditor (image) and controls
  const focalPointEditor = page.locator('[data-component="FocalPointEditor"]');
  const aspectRatioSlider = page.locator('[data-component="AspectRatioSlider"]');
  const focalPointButton = page.locator('[data-component="FocalPointButton"]');
  const imageOverflowButton = page.locator('[data-component="ImageOverflowButton"]');
  const codeSnippetButton = page.locator('[data-component="CodeSnippetButton"]');
  const uploadButton = page.getByRole("button", { name: "Upload" });

  return Promise.all([
    expect(focalPointEditor).toBeVisible(),
    expect(aspectRatioSlider).toBeVisible(),
    expect(focalPointButton).toBeVisible(),
    expect(imageOverflowButton).toBeVisible(),
    expect(codeSnippetButton).toBeVisible(),
    expect(uploadButton).toBeVisible(),
  ]);
}

test.describe("Landing upload", () => {
  test("image upload with IndexedDB available redirects to /edit and shows editor", async ({
    page,
  }) => {
    await page.goto("/");

    const landing = page.locator('[data-component="Landing"]');
    await expect(landing).toBeVisible();
    await expect(landing.getByRole("button", { name: "Upload" })).toBeVisible();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      landing.getByRole("button", { name: "Upload" }).click(),
    ]);
    await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

    await expect(page).toHaveURL(/\/edit$/);
    await expectEditorWithControlsVisible(page);
  });

  test("image upload with IndexedDB disabled stays on / and shows editor", async ({
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
    await expect(landing).toBeVisible();
    await expect(landing.getByRole("button", { name: "Upload" })).toBeVisible();

    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      landing.getByRole("button", { name: "Upload" }).click(),
    ]);
    await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

    await expect(page).toHaveURL("/");
    await expectEditorWithControlsVisible(page);
  });
});
