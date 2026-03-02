import { test, expect } from "@playwright/test";

test.describe("Public Navigation", () => {
  test("landing page renders", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.locator("h1")).toContainText("Replace 30+ career tools");
  });

  test("landing page has features section", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.locator("#features")).toBeVisible();
  });

  test("landing page has pricing section", async ({ page }) => {
    await page.goto("/landing");
    await expect(page.locator("#pricing")).toBeVisible();
  });

  test("jobs page renders", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.locator("h1")).toContainText("Jobs");
  });

  test("salary page renders", async ({ page }) => {
    await page.goto("/salary");
    await expect(page.locator("h1")).toContainText("Compensation Reality Engine");
  });

  test("skills page renders", async ({ page }) => {
    await page.goto("/skills");
    await expect(page.locator("h1")).toContainText("Skills Genome");
  });

  test("paths page renders", async ({ page }) => {
    await page.goto("/paths");
    await expect(page.locator("h1")).toContainText("Path Simulator");
  });

  test("indices page renders", async ({ page }) => {
    await page.goto("/indices");
    await expect(page.locator("h1")).toContainText("Planeta Indices");
  });

  test("radar page renders", async ({ page }) => {
    await page.goto("/radar");
    await expect(page.locator("h1")).toContainText("Opportunity Radar");
  });

  test("relocation page renders", async ({ page }) => {
    await page.goto("/relocation");
    await expect(page.locator("h1")).toContainText("Relocation Intelligence");
  });

  test("immigration page renders", async ({ page }) => {
    await page.goto("/immigration");
    await expect(page.locator("h1")).toContainText("Immigration Intelligence");
  });

  test("career-map page renders", async ({ page }) => {
    await page.goto("/career-map");
    await expect(page.locator("h1")).toContainText("Career Map");
  });

  test("negotiation page renders", async ({ page }) => {
    await page.goto("/negotiation");
    await expect(page.locator("h1")).toContainText("Negotiation Intelligence");
  });

  test("agents page renders", async ({ page }) => {
    await page.goto("/agents");
    await expect(page.locator("h1")).toContainText("OpenClaw Agents");
  });

  test("talent fabric page renders", async ({ page }) => {
    await page.goto("/talent-fabric");
    await expect(page.locator("h1")).toContainText("Global Talent Fabric");
  });

  test("skill tree page renders", async ({ page }) => {
    await page.goto("/skill-tree");
    await expect(page.locator("h1")).toContainText("Skill Tree");
  });
});

test.describe("SEO", () => {
  test("sitemap.xml returns valid XML", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const contentType = response?.headers()["content-type"];
    expect(contentType).toContain("xml");
  });

  test("robots.txt returns valid text", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
  });
});
