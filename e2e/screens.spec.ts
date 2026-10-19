import { expect, test } from "./pharmacy";
import { openTab, signIn } from "./helpers";

test.describe("every screen renders its own work", () => {
  test.beforeEach(async ({ page }) => await signIn(page, "owner"));

  test("Today opens with the money at stake", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "of stock may expire unsold",
    );
    await expect(page.getByText("Stock on shelf")).toBeVisible();
    await expect(page.getByText("Return windows")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Decide today/ })).toBeVisible();
  });

  test("the shelf calendar switches range", async ({ page }) => {
    const six = page.getByRole("button", { name: "6 months" });
    await six.click();
    await expect(six).toHaveAttribute("aria-pressed", "true");
  });

  test("Batches filters, sorts and segments the register", async ({ page }) => {
    await openTab(page, "Batches");
    await expect(page.getByRole("heading", { name: "Batches" })).toBeVisible();

    await page.getByRole("searchbox").fill("Seclo");
    await expect(page.getByRole("button", { name: /SEC-2210/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /NPX-4417/ })).toBeHidden();

    await page.getByRole("searchbox").fill("nothing matches this");
    await expect(page.getByText("No batches match those filters")).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByRole("button", { name: /NPX-4417/ })).toBeVisible();
  });

  test("a register row opens its batch", async ({ page }) => {
    await openTab(page, "Batches");
    await page.getByRole("button", { name: /NPX-4417/ }).click();

    await expect(page).toHaveURL(/\/batches\/NPX-4417$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Napa Extra 500mg");
    await expect(page.getByText("Dead stock risk")).toBeVisible();
    await expect(page.getByText("What drove the score")).toBeVisible();
  });

  test("receiving a batch refuses figures that cannot be true", async ({ page }) => {
    await openTab(page, "Batches");
    await page.getByRole("button", { name: "Receive batch" }).click();

    await page.getByRole("button", { name: "Put on the shelf" }).click();
    await expect(page.getByText(/fields need fixing/)).toBeVisible();
  });

  test("Suppliers shows the windows that are closing", async ({ page }) => {
    await openTab(page, "Suppliers");
    await expect(page.getByRole("heading", { name: "Suppliers" })).toBeVisible();
    await expect(page.getByText("Return windows closing")).toBeVisible();
    await expect(page.getByText("days left").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Beximco Pharma" })).toBeVisible();
  });

  test("a supplier card carries its filter over to the register", async ({ page }) => {
    await openTab(page, "Suppliers");
    await page
      .getByRole("article")
      .filter({ hasText: "Incepta" })
      .getByRole("button", { name: "View batches" })
      .click();

    await expect(page).toHaveURL(/\/batches$/);
    await expect(page.getByRole("button", { name: /SEC-2210/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /NPX-4417/ })).toBeHidden();
  });

  test("Reports adds up the month", async ({ page }) => {
    await openTab(page, "Reports");
    await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
    await expect(page.getByText("Recovered by returns")).toBeVisible();
    await expect(page.getByText("Value at risk by expiry month")).toBeVisible();
    await expect(page.getByText("Value at risk by supplier")).toBeVisible();
    await expect(page.getByText("No discounts are live")).toBeVisible();
  });

  test("a discount applied on a batch shows up in Reports", async ({ page }) => {
    await page.goto("/batches/NPX-4417");
    await page.getByRole("button", { name: "15%", exact: true }).click();
    await page.getByRole("button", { name: /Apply 15% off/ }).click();

    await openTab(page, "Reports");
    await expect(page.getByText("15% off", { exact: true })).toBeVisible();
    await expect(page.getByText("No discounts are live")).toBeHidden();
  });

  test("the risk model simulator reacts to the sliders", async ({ page }) => {
    await openTab(page, "Risk model");
    await expect(page.getByRole("heading", { name: "Risk model" })).toBeVisible();

    await page.locator("#sim-rate").fill("8");
    await expect(page.getByText("healthy")).toBeVisible();

    await page.locator("#sim-rate").fill("0");
    await expect(page.getByText("act now")).toBeVisible();
  });

  test("a preset loads a real batch into the model", async ({ page }) => {
    await openTab(page, "Risk model");

    const preset = page.getByRole("button", { name: /^\w+ [A-Z]{2,4}-\d{3,5}$/ }).first();
    await expect(preset).toBeVisible();
    await preset.click();

    await expect(page.locator("#sim-left")).not.toHaveValue("0");
    await expect(page.locator("#sim-days")).not.toHaveValue("0");
  });

  test("the model shows its weights and where it can be wrong", async ({ page }) => {
    await openTab(page, "Risk model");
    await expect(page.getByText("Learned weights")).toBeVisible();
    await expect(page.getByText("Coverage (projected sales ÷ stock)")).toBeVisible();
    await expect(page.getByText(/past batches/)).toBeVisible();
    await expect(page.getByText("Where it can be wrong")).toBeVisible();
    await expect(page.getByText(/Seasonality is invisible/)).toBeVisible();
  });
});

test.describe("the shell", () => {
  test("the theme toggle is remembered across a reload", async ({ page }) => {
    await signIn(page, "owner");

    await page.getByRole("button", { name: /Switch to dark theme/ }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("the approvals tab carries the pending count", async ({ page }) => {
    await signIn(page, "owner");
    const tab = page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: /Approvals/ });

    await expect(tab).toContainText("3 waiting for approval");
  });

  test("an unknown batch is answered, not crashed into", async ({ page }) => {
    await signIn(page, "owner");
    await page.goto("/batches/NOPE-0000");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("No batch numbered");
    await expect(page.getByRole("link", { name: "Back to the register" })).toBeVisible();
  });

  test("an unknown route gets the 404 screen", async ({ page }) => {
    await page.goto("/not-a-real-page");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("not on the shelf");
  });
});
