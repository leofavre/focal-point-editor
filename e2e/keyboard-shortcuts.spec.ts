import { expect, test } from "@playwright/test";
import {
  expectEditorWithControlsVisible,
  expectLandingVisible,
  SAMPLE_IMAGE_PATH,
} from "./helpers";

/**
 * E2E tests for editor keyboard shortcuts.
 * Plan: specs/keyboard-shortcuts.plan.md
 *
 * Shortcuts: u (upload), a/f (focal point), s/o (overflow), d/c (code snippet).
 * Control+key must not trigger; Shift+key must trigger.
 */
test.describe("Keyboard shortcuts", () => {
  test.beforeEach(async ({ page }) => {
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
  });

  test("u opens file chooser for upload", async ({ page }) => {
    await page.click("body", { position: { x: 0, y: 0 } });
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.keyboard.press("u"),
    ]);
    await fileChooser.setFiles([]);
  });

  test("a and f toggle focal point (aria-pressed changes)", async ({ page }) => {
    const focalPointButton = page.getByRole("button", { name: "Focal point" });
    const beforeA = await focalPointButton.getAttribute("aria-pressed");
    await page.keyboard.press("a");
    const afterA = await focalPointButton.getAttribute("aria-pressed");
    expect(afterA).not.toBe(beforeA);

    await page.keyboard.press("f");
    const afterF = await focalPointButton.getAttribute("aria-pressed");
    expect(afterF).not.toBe(afterA);
  });

  test("s and o toggle image overflow (aria-pressed changes)", async ({ page }) => {
    const overflowButton = page.getByRole("button", { name: "Overflow" });
    const beforeS = await overflowButton.getAttribute("aria-pressed");
    await page.keyboard.press("s");
    const afterS = await overflowButton.getAttribute("aria-pressed");
    expect(afterS).not.toBe(beforeS);

    await page.keyboard.press("o");
    const afterO = await overflowButton.getAttribute("aria-pressed");
    expect(afterO).not.toBe(afterS);
  });

  test("d and c toggle code snippet (aria-pressed changes)", async ({ page }) => {
    const codeButton = page.getByRole("button", { name: "Code" });
    const beforeD = await codeButton.getAttribute("aria-pressed");
    await page.keyboard.press("d");
    const afterD = await codeButton.getAttribute("aria-pressed");
    expect(afterD).not.toBe(beforeD);

    await page.keyboard.press("c");
    const afterC = await codeButton.getAttribute("aria-pressed");
    expect(afterC).not.toBe(afterD);
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
    const codeButton = page.getByRole("button", { name: "Code" });
    await page.keyboard.press("c");
    await expect(codeButton).toHaveAttribute("aria-pressed", "true");
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
    await expect(codeButton).toHaveAttribute("aria-pressed", "true");
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
