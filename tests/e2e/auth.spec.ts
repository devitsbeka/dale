import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Sign in");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("register page renders", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("h1")).toContainText("Create account");
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("login page has link to register", async ({ page }) => {
    await page.goto("/login");
    const registerLink = page.locator('a[href="/register"]');
    await expect(registerLink).toBeVisible();
  });

  test("register page has link to login", async ({ page }) => {
    await page.goto("/register");
    const loginLink = page.locator('a[href="/login"]');
    await expect(loginLink).toBeVisible();
  });
});
