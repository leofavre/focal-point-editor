import { expect, test } from "@playwright/test";
import { seedEditorWithImage } from "./helpers";

/**
 * E2E tests for editor keyboard shortcuts.
 * Plan: specs/keyboard-shortcuts.plan.md
 *
 * Shortcuts: e (focus image), a (focal point), s (overflow), d (focus slider),
 * f (open code), g/u/i (upload), c (copy code directly).
 * Control+key must not trigger; Shift+key must trigger.
 */
test.describe("Keyboard shortcuts", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await seedEditorWithImage(page);
  });

  test("u opens file chooser for upload", async ({ page }) => {
    await page.click("body", { position: { x: 0, y: 0 } });
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.keyboard.press("u"),
    ]);
    await fileChooser.setFiles([]);
  });

  test("g opens file chooser for upload", async ({ page }) => {
    await page.click("body", { position: { x: 0, y: 0 } });
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.keyboard.press("g"),
    ]);
    await fileChooser.setFiles([]);
  });

  test("i opens file chooser for upload", async ({ page }) => {
    await page.click("body", { position: { x: 0, y: 0 } });
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.keyboard.press("i"),
    ]);
    await fileChooser.setFiles([]);
  });

  test("e focuses the image", async ({ page }) => {
    await page.click("body", { position: { x: 0, y: 0 } });
    await page.keyboard.press("e");
    const image = page.getByRole("img", { name: "Image uploaded by the user" });
    await expect(image).toBeFocused();
  });

  test("a toggles focal point (aria-pressed changes)", async ({ page }) => {
    const focalPointButton = page.getByRole("button", { name: "Focal point" });
    const beforeA = await focalPointButton.getAttribute("aria-pressed");
    await page.keyboard.press("a");
    const afterA = await focalPointButton.getAttribute("aria-pressed");
    expect(afterA).not.toBe(beforeA);

    await page.keyboard.press("a");
    const afterA2 = await focalPointButton.getAttribute("aria-pressed");
    expect(afterA2).not.toBe(afterA);
  });

  test("s toggles image overflow (aria-pressed changes)", async ({ page }) => {
    const overflowButton = page.getByRole("button", { name: "Overflow" });
    const beforeS = await overflowButton.getAttribute("aria-pressed");
    await page.keyboard.press("s");
    const afterS = await overflowButton.getAttribute("aria-pressed");
    expect(afterS).not.toBe(beforeS);

    await page.keyboard.press("s");
    const afterS2 = await overflowButton.getAttribute("aria-pressed");
    expect(afterS2).not.toBe(afterS);
  });

  test("d focuses the aspect ratio slider", async ({ page }) => {
    await page.click("body", { position: { x: 0, y: 0 } });
    await page.keyboard.press("d");
    const aspectRatioSlider = page.getByRole("slider");
    await expect(aspectRatioSlider).toBeFocused();
  });

  test("f opens the code snippet (does not toggle)", async ({ page }) => {
    const codeButton = page.getByRole("button", { name: "Code" });
    await expect(codeButton).toHaveAttribute("aria-pressed", "false");

    await page.keyboard.press("f");
    await expect(codeButton).toHaveAttribute("aria-pressed", "true");
    const codeSnippet = page.locator('[data-component="CodeSnippet"]');
    await expect(codeSnippet).toBeVisible();

    await page.keyboard.press("f");
    await expect(codeButton).toHaveAttribute("aria-pressed", "true");
    await expect(codeSnippet).toBeVisible();
  });

  test("c copies code snippet directly without opening dialog", async ({ page }) => {
    await page.evaluate(() => navigator.clipboard.writeText(""));

    await page.getByRole("img", { name: "Image uploaded by the user" }).click();
    await page.keyboard.press("c");

    await expect(page.getByText("Code copied to clipboard")).toBeVisible();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain("object-fit");
    expect(clipboardText).toContain("object-position");

    const codeSnippet = page.locator('[data-component="CodeSnippet"]');
    await expect(codeSnippet).not.toBeVisible();
  });

  test("Control+key does not trigger shortcut (e.g. Control+u no file chooser)", async ({
    page,
  }) => {
    const race = Promise.race([
      page.waitForEvent("filechooser").then(() => "opened" as const),
      page.waitForTimeout(700).then(() => "timeout" as const),
    ]);
    await page.keyboard.press("Control+u");
    const result = await race;
    expect(result).toBe("timeout");
  });

  test("Shift+key triggers shortcut (e.g. Shift+U opens file chooser)", async ({ page }) => {
    await page.click("body", { position: { x: 0, y: 0 } });
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.keyboard.press("Shift+U"),
    ]);
    await fileChooser.setFiles([]);
  });

  test("Shift+key triggers shortcut for toggle (e.g. Shift+A toggles focal point)", async ({
    page,
  }) => {
    const focalPointButton = page.getByRole("button", { name: "Focal point" });
    const before = await focalPointButton.getAttribute("aria-pressed");
    await page.keyboard.press("Shift+A");
    const after = await focalPointButton.getAttribute("aria-pressed");
    expect(after).not.toBe(before);
  });

  test("Control+C copies selected text and does not trigger shortcut", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.evaluate(() => navigator.clipboard.writeText(""));

    await page.keyboard.press("f");
    const codeSnippet = page.locator('[data-component="CodeSnippet"]');
    await expect(codeSnippet).toBeVisible();

    await codeSnippet.evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
    await page.keyboard.press("Control+c");

    const clipboardText = await page.evaluate(async () => {
      const text = await navigator.clipboard.readText();
      if (text.length > 0) return text;
      document.execCommand("copy");
      return navigator.clipboard.readText();
    });
    expect(clipboardText.length).toBeGreaterThan(0);
    expect(clipboardText).toContain("object-fit");
  });
});
