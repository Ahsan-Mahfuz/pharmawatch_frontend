import { expect, test } from "./pharmacy";
import { signIn } from "./helpers";

const sidewaysOverflow = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );

test.describe("on a phone", () => {
  test("the sign in card fits without sideways scrolling", async ({ page }) => {
    await page.goto("/signin");
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(1);
  });

  test("Today fits the screen and the tabs stay reachable", async ({ page }) => {
    await signIn(page, "owner");

    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(1);
    await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
  });

  test("the register scrolls inside its own card, not the page", async ({ page }) => {
    await signIn(page, "owner");
    await page.goto("/batches");

    await expect(page.getByRole("button", { name: /NPX-4417/ })).toBeVisible();
    expect(await sidewaysOverflow(page)).toBeLessThanOrEqual(1);
  });

  test("the counter still sells", async ({ page }) => {
    await signIn(page, "owner");
    await page.goto("/counter");

    await page.getByLabel("Find a medicine").fill("Napa");
    await page.getByRole("button", { name: "Add one Napa Extra 500mg" }).click();
    await page.getByRole("button", { name: "Complete sale" }).click();

    await expect(page.getByRole("status").first()).toContainText("Sale recorded");
  });
});
