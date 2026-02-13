import fs from "node:fs";
import { expect, test } from "@playwright/test";
import { test as testWithFixtures } from "./fixtures";
import {
  expectEditorWithControlsVisible,
  expectLandingVisible,
  SAMPLE_IMAGE_PATH,
} from "./helpers";

/**
 * Simulate a file drop. react-dropzone's onDrop runs only when the drop event targets
 * the root (the overlay). So we: 1) dispatch dragenter on document to show the overlay,
 * 2) wait for the overlay, 3) dispatch dragover and drop on the overlay with the file.
 */
async function dropImageFileOnPage(page: import("@playwright/test").Page) {
  const buffer = fs.readFileSync(SAMPLE_IMAGE_PATH);
  const base64 = buffer.toString("base64");

  await page.evaluate(
    async (payload: { b64: string; name: string; type: string }) => {
      const res = await fetch(`data:${payload.type};base64,${payload.b64}`);
      const blob = await res.blob();
      const file = new File([blob], payload.name, { type: payload.type });
      const dt = new DataTransfer();
      dt.items.add(file);
      const opts = { bubbles: true, cancelable: true, dataTransfer: dt };
      document.dispatchEvent(new DragEvent("dragenter", opts));
    },
    { b64: base64, name: "sample.png", type: "image/png" },
  );

  await page.locator('[data-component="FullScreenDropZone"]').waitFor({ state: "visible" });

  await page.evaluate(
    async (payload: { b64: string; name: string; type: string }) => {
      const overlay = document.querySelector('[data-component="FullScreenDropZone"]');
      if (!overlay) return;
      const res = await fetch(`data:${payload.type};base64,${payload.b64}`);
      const blob = await res.blob();
      const file = new File([blob], payload.name, { type: payload.type });
      const dt = new DataTransfer();
      dt.items.add(file);
      const opts = { bubbles: true, cancelable: true, dataTransfer: dt };
      overlay.dispatchEvent(new DragEvent("dragover", opts));
      overlay.dispatchEvent(new DragEvent("drop", opts));
    },
    { b64: base64, name: "sample.png", type: "image/png" },
  );
}

/**
 * Simulate drag over the page then "drop outside": dragenter, dragover, dragleave (no drop).
 * Done in one evaluate so the same DataTransfer is used; no drop event is dispatched.
 */
async function dragImageThenDropOutside(page: import("@playwright/test").Page) {
  const buffer = fs.readFileSync(SAMPLE_IMAGE_PATH);
  const base64 = buffer.toString("base64");

  await page.evaluate(
    async (payload: { b64: string; name: string; type: string }) => {
      const res = await fetch(`data:${payload.type};base64,${payload.b64}`);
      const blob = await res.blob();
      const file = new File([blob], payload.name, { type: payload.type });
      const dt = new DataTransfer();
      dt.items.add(file);
      const opts = { bubbles: true, cancelable: true, dataTransfer: dt };
      const doc = document;
      doc.dispatchEvent(new DragEvent("dragenter", opts));
      doc.dispatchEvent(new DragEvent("dragover", opts));
      doc.dispatchEvent(new DragEvent("dragleave", opts));
    },
    { b64: base64, name: "sample.png", type: "image/png" },
  );
}

test.describe("Drag-drop", () => {
  test("with IndexedDB: drop file on app then image uploaded and redirect to /edit", async ({
    page,
  }) => {
    await page.goto("/");
    await expectLandingVisible(page);

    await dropImageFileOnPage(page);

    await expect(page).toHaveURL(/\/edit$/);
    await expectEditorWithControlsVisible(page);
  });

  testWithFixtures(
    "without IndexedDB: drop file on app then image uploaded and redirect to /edit",
    async ({ pageWithoutIndexedDB: page }) => {
      await page.goto("/");
      await expectLandingVisible(page);

      await dropImageFileOnPage(page);

      await expect(page).toHaveURL(/\/edit$/);
      await expectEditorWithControlsVisible(page);
    },
  );

  test("with IndexedDB: file dragged but dropped outside browser then app stays responsive and no redirect", async ({
    page,
  }) => {
    await page.goto("/");
    const landing = page.locator('[data-component="Landing"]');
    await expectLandingVisible(page);

    await dragImageThenDropOutside(page);

    await expect(page).toHaveURL("/");
    await expect(landing).toBeVisible();
    const uploadButton = landing.getByRole("button", { name: "Upload" });
    await expect(uploadButton).toBeVisible();
    await expect(uploadButton).toBeEnabled();
    await expect(page.locator('[data-component="FullScreenDropZone"]')).toHaveCount(0);
  });

  testWithFixtures(
    "without IndexedDB: file dragged but dropped outside browser then app stays responsive and no redirect",
    async ({ pageWithoutIndexedDB: page }) => {
      await page.goto("/");
      const landing = page.locator('[data-component="Landing"]');
      await expectLandingVisible(page);

      await dragImageThenDropOutside(page);

      await expect(page).toHaveURL("/");
      await expect(landing).toBeVisible();
      const uploadButton = landing.getByRole("button", { name: "Upload" });
      await expect(uploadButton).toBeVisible();
      await expect(uploadButton).toBeEnabled();
      await expect(page.locator('[data-component="FullScreenDropZone"]')).toHaveCount(0);
    },
  );
});
