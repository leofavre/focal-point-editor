import { test, expect } from "@playwright/test";
import { test as testWithFixtures } from "./fixtures";

test.describe("Not-found and image-not-found", () => {
  testWithFixtures.skip("/bogus with IndexedDB off shows page not found", async ({
    pageWithoutIndexedDB: page,
  }) => {
    await page.goto("/bogus");
    await expect(page.getByText("Page not found...")).toBeVisible();
  });

  test("/bogus with IndexedDB on (empty DB) shows page not found", async ({
    page,
  }) => {
    await page.goto("/bogus");
    await expect(page.getByText("Page not found...")).toBeVisible();
  });

  testWithFixtures.skip("/edit with IndexedDB off shows page not found", async ({
    pageWithoutIndexedDB: page,
  }) => {
    await page.goto("/edit");
    await expect(page.getByText("Page not found...")).toBeVisible();
  });

  test("/edit with IndexedDB on (empty DB) shows image not found", async ({
    page,
  }) => {
    await page.goto("/edit");
    await expect(
      page.getByText(/Start by uploading an image\.\.\.|Image not found\.\.\./),
    ).toBeVisible();
    await expect(page.getByText("Page not found...")).not.toBeVisible();
  });
});
