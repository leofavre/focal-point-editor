import { test as base } from "@playwright/test";
import { disableIndexedDBOnContext } from "./helpers";

type IndexedDBFixtures = {
  /**
   * A page whose context has IndexedDB disabled (same as app "IndexedDB unavailable").
   * Use this fixture instead of `page` when the test should run with IndexedDB off.
   */
  pageWithoutIndexedDB: import("@playwright/test").Page;
};

export const test = base.extend<IndexedDBFixtures>({
  pageWithoutIndexedDB: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      baseURL: baseURL ?? "http://localhost:5173",
    });
    await disableIndexedDBOnContext(context);
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
