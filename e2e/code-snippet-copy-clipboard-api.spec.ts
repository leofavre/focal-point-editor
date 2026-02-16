import { expect, test } from "@playwright/test";
import {
  dragImageInFocalPointEditor,
  expectEditorWithControlsVisible,
  expectLandingVisible,
  SAMPLE_IMAGE_PATH,
} from "./helpers";

/**
 * Code snippet copy with Clipboard API available.
 * Plan: e2e/code-snippet-copy.plan.md (test 1.1)
 */
test.describe("Code snippet copy – Clipboard API available", () => {
  test.use({ permissions: ["clipboard-read", "clipboard-write"] });

  test("copies code snippet with correct object-position when Clipboard API is available", async ({
    page,
  }) => {
    await page.goto("/");
    await expectLandingVisible(page);

    const landing = page.locator('[data-component="Landing"]');
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      landing.getByRole("button", { name: "Upload image", exact: true }).click(),
    ]);
    await fileChooser.setFiles(SAMPLE_IMAGE_PATH);

    await expect(page).toHaveURL(/\/edit$/);
    await expectEditorWithControlsVisible(page);

    const aspectRatioSlider = page.locator(
      '[data-component="AspectRatioControl"] input[type="range"]',
    );
    await expect(aspectRatioSlider).toBeVisible();
    const sliderBox = await aspectRatioSlider.boundingBox();
    if (sliderBox) {
      await aspectRatioSlider.click({
        position: { x: sliderBox.width * 0.3, y: sliderBox.height / 2 },
      });
    }

    await dragImageInFocalPointEditor(page);

    await page.locator('[data-component="CodeSnippetButton"]').click();

    const codeSnippet = page.locator('[data-component="CodeSnippet"]');
    await expect(codeSnippet).toBeVisible();

    const codeBlock = codeSnippet.locator("pre").first();
    await expect(codeBlock).toBeVisible();
    const snippetText = await codeBlock.textContent();
    expect(snippetText).toBeTruthy();
    const objectPositionMatch = snippetText?.match(/object-position:\s*([^;]+)/);
    expect(objectPositionMatch).toBeTruthy();
    const expectedObjectPosition = objectPositionMatch?.[1]?.trim() ?? "";
    expect(expectedObjectPosition).toBeTruthy();

    await codeSnippet.getByRole("button", { name: "Copy" }).click();
    await expect(codeSnippet.getByRole("button", { name: "Copied!" })).toBeVisible();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain(expectedObjectPosition);
  });
});
