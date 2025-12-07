import { expect, type Page, test } from "@playwright/test";

const PAYLOAD_BLANK_TEMPLATE_TITLE_REGEX = /Payload Blank Template/;
test.describe("Frontend", () => {
  let _page: Page;

  test.beforeAll(async ({ browser }, _testInfo) => {
    const context = await browser.newContext();
    _page = await context.newPage();
  });

  test("can go on homepage", async ({ page }) => {
    await page.goto("http://localhost:3000");

    await expect(page).toHaveTitle(PAYLOAD_BLANK_TEMPLATE_TITLE_REGEX);

    const heading = page.locator("h1").first();

    await expect(heading).toHaveText("Welcome to your new project.");
  });
});
