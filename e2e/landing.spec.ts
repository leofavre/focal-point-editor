import { test, expect } from "@playwright/test";
import { expectLandingVisible } from "./helpers";
import { test as testWithFixtures } from "./fixtures";

test.describe("Landing page", () => {
  test("with IndexedDB: shows project description and upload button when visiting /", async ({
    page,
  }) => {
    await page.goto("/");
    await expectLandingVisible(page);
    const landing = page.locator('[data-component="Landing"]');
    await expect(landing.locator('[data-component="HowToUse"]')).toBeVisible();
  });

  testWithFixtures("without IndexedDB: shows project description and upload button when visiting /", async ({
    pageWithoutIndexedDB: page,
  }) => {
    await page.goto("/");
    await expectLandingVisible(page);
    const landing = page.locator('[data-component="Landing"]');
    await expect(landing.locator('[data-component="HowToUse"]')).toBeVisible();
  });
});
