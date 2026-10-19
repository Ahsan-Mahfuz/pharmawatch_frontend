import { expect, test } from "./pharmacy";
import { API_URL } from "./api-url";
import { banner, openTab, signIn } from "./helpers";

test.describe("the catalogue", () => {
  test.beforeEach(async ({ page }) => await signIn(page, "owner"));

  test("a new medicine can be added and then received against", async ({ page }) => {
    await openTab(page, "Medicines");
    await page.getByRole("button", { name: "Add a medicine" }).click();

    await page.getByLabel("Brand name").fill("Ace Plus");
    await page.getByLabel("Generic").fill("Paracetamol + Caffeine");
    await page.getByLabel("Strength").fill("500mg");
    await page.getByLabel("Manufacturer").fill("Square Pharma");
    await page.getByLabel("Form").selectOption("tablet");
    await page.getByLabel("Counted in").selectOption("strips");
    await page.getByRole("button", { name: "Add to the catalogue" }).click();

    await expect(page.getByRole("status")).toContainText("Ace Plus 500mg is in the catalogue");
    await expect(page.getByRole("listitem").filter({ hasText: "Ace Plus" })).toContainText(
      "no stock",
    );

    await openTab(page, "Batches");
    await page.getByRole("button", { name: "Receive batch" }).click();
    await page.getByLabel("Medicine").selectOption({
      label: "Ace Plus 500mg · Paracetamol + Caffeine",
    });
    await page.getByLabel("Supplier", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Batch number").fill("ACE-7001");
    await page.getByLabel("Quantity").fill("200");
    await page.getByLabel("Cost per unit").fill("20");
    await page.getByLabel("Counter price").fill("30");
    await page.getByLabel("Expires").fill("2027-12-31");
    await page.getByRole("button", { name: "Put on the shelf" }).click();

    await expect(page.getByRole("status")).toContainText("ACE-7001 is on the shelf");
    await expect(page.getByRole("button", { name: /ACE-7001/ })).toBeVisible();
  });

  test("a medicine the catalogue already has cannot be added twice", async ({ page }) => {
    await openTab(page, "Medicines");
    await page.getByRole("button", { name: "Add a medicine" }).click();

    await page.getByLabel("Brand name").fill("Napa Extra");
    await page.getByLabel("Generic").fill("Paracetamol + Caffeine");
    await page.getByLabel("Strength").fill("500mg");
    await page.getByLabel("Form").selectOption("tablet");
    await page.getByRole("button", { name: "Add to the catalogue" }).click();

    await expect(page.getByRole("status")).toContainText(
      "Napa Extra 500mg is already in the catalogue",
    );
    await expect(banner(page)).toContainText("Already in the catalogue");
  });

  test("a supplier is added and its return window reaches a new batch", async ({ page }) => {
    await openTab(page, "Suppliers");
    await page.getByRole("button", { name: "Add a supplier" }).click();

    await page.getByLabel("Supplier name").fill("Aristopharma");
    await page.getByLabel("Phone").fill("01711000099");
    await page.getByLabel("Return window").fill("30");
    await page.getByRole("button", { name: "Add the supplier" }).click();

    await expect(page.getByRole("status")).toContainText("Aristopharma is on the supplier list");
    await expect(
      page.getByRole("list", { name: "Suppliers" }).getByRole("listitem")
        .filter({ hasText: "Aristopharma" }),
    ).toContainText("30 days");
  });

  test("a supplier's return window can be corrected", async ({ page }) => {
    await openTab(page, "Suppliers");
    const row = page.getByRole("list", { name: "Suppliers" })
      .getByRole("listitem").filter({ hasText: "Renata" });

    await row.getByRole("button", { name: /Edit Renata/ }).click();
    await page.getByLabel("Return window").fill("45");
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByRole("status")).toContainText("Renata is saved");
    await expect(
      page.getByRole("list", { name: "Suppliers" }).getByRole("listitem")
        .filter({ hasText: "Renata" }),
    ).toContainText("45 days");
  });
});

test.describe("a pharmacy starting from nothing", () => {
  test("stocks itself: a medicine, a supplier, then its first batch", async ({ page, request }) => {
    await request.post(`${API_URL}/test/empty`);

    await signIn(page, "owner");
    await openTab(page, "Batches");
    await expect(page.getByText("The register is empty")).toBeVisible();

    await page.getByRole("button", { name: "Receive batch" }).click();
    await expect(page.getByText(/A medicine is not on file yet/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Put on the shelf" })).toBeDisabled();

    await openTab(page, "Medicines");
    await expect(page.getByText(/The catalogue is empty/)).toBeVisible();
    await page.getByRole("button", { name: "Add a medicine" }).click();
    await page.getByLabel("Brand name").fill("Monas");
    await page.getByLabel("Generic").fill("Montelukast");
    await page.getByLabel("Strength").fill("10mg");
    await page.getByLabel("Form").selectOption("tablet");
    await page.getByRole("button", { name: "Add to the catalogue" }).click();
    await expect(page.getByRole("status")).toContainText("Monas 10mg is in the catalogue");

    await openTab(page, "Suppliers");
    await page.getByRole("button", { name: "Add a supplier" }).click();
    await page.getByLabel("Supplier name").fill("Incepta");
    await page.getByLabel("Return window").fill("120");
    await page.getByRole("button", { name: "Add the supplier" }).click();
    await expect(page.getByRole("status")).toContainText("Incepta is on the supplier list");

    await openTab(page, "Batches");
    await page.getByRole("button", { name: "Receive batch" }).click();
    await page.getByLabel("Medicine").selectOption({ label: "Monas 10mg · Montelukast" });
    await page.getByLabel("Supplier", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Batch number").fill("MON-1001");
    await page.getByLabel("Quantity").fill("150");
    await page.getByLabel("Cost per unit").fill("110");
    await page.getByLabel("Counter price").fill("150");
    await page.getByLabel("Expires").fill("2027-09-30");
    await page.getByRole("button", { name: "Put on the shelf" }).click();

    await expect(page.getByRole("status")).toContainText("MON-1001 is on the shelf");
    await expect(page.getByRole("button", { name: /MON-1001/ })).toBeVisible();

    await openTab(page, "Counter sale");
    await page.getByRole("button", { name: "Add one Monas 10mg" }).click();
    await page.getByRole("button", { name: "Complete sale" }).click();
    await expect(page.getByRole("status")).toContainText(/Sale recorded .* INV-\d+/);
  });
});
