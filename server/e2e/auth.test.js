// @ts-check
import { test, expect } from "@playwright/test";
const BASE_URL = "http://localhost:5173";

test.describe("Authentication", async () => {
  test("Login with new user", async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE_URL}/login`);

    await page.fill('input[placeholder="someone@gmail.com"]', "1@gmail.com");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE_URL}/login`);

    await page.fill('input[placeholder="Password"]', "2");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(`${BASE_URL}/login`);

    await page.fill('input[placeholder="Password"]', "1");
    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForURL(`${BASE_URL}`),
    ]);

    await expect(page.locator("text=Custom Filters")).toBeVisible();
  });
  test("Signup with new user", async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    const now = new Date().toISOString();
    const formattedNow = now.replace(/[:.]/g, "-");

    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL(`${BASE_URL}/register`);

    await page.fill('input[placeholder="Username"]', `${formattedNow}`);
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL(`${BASE_URL}/register`);

    await page.fill(
      'input[placeholder="someone@gmail.com"]',
      `${formattedNow}@gmail.com`
    );
    await page.click('button:has-text("Next")');
    await expect(page).toHaveURL(`${BASE_URL}/register`);

    const passwordFields = page.locator('input[placeholder="Password"]');
    await expect(passwordFields).toHaveCount(2);
    await passwordFields.nth(0).fill("1");
    await passwordFields.nth(1).fill("2");
    await page.click('button:has-text("Next")');

    await passwordFields.nth(1).fill("1");
    await page.click('button:has-text("Next")');

    await page.waitForSelector('text="Create Profile"', {
      state: "visible",
    });
    await page.fill('input[placeholder="Create a Bio"]', "Playwright test");
    await page.waitForSelector('input[placeholder="Enter address..."]');
    await page.fill('input[placeholder="Enter address..."]', "Canada");
    await page.waitForSelector(".pac-container", {
      state: "attached",
      timeout: 10_000,
    });
    const firstField = page.locator(".pac-container .pac-item").first();
    await firstField.waitFor({
      state: "visible",
      timeout: 10_000,
    });
    await page
      .getByRole("textbox", { name: "Enter address..." })
      .press("ArrowDown");
    await page
      .getByRole("textbox", { name: "Enter address..." })
      .press("Enter");
    await Promise.all([
      page.waitForURL(`${BASE_URL}`),
      page.click("text=Submit"),
    ]);
    await expect(page.locator("text=Custom Filters")).toBeVisible();
  });
});
