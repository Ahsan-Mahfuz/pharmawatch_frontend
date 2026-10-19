import { expect, test } from "./pharmacy";
import { openTab, signIn, toast } from "./helpers";

const NAPA = "Napa Extra 500mg";

test.describe("the counter", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, "pharmacist");
    await openTab(page, "Counter sale");
    await expect(page.getByRole("heading", { name: "Counter sale" })).toBeVisible();
  });

  test("sells the batch that expires first, not the newest", async ({ page }) => {
    await page.getByLabel("Find a medicine").fill("Napa");

    const row = page.getByRole("list", { name: "Medicines" })
      .getByRole("listitem").filter({ hasText: NAPA });
    await expect(row).toContainText("next from NPX-4417");

    await row.getByRole("button", { name: `Add one ${NAPA}` }).click();
    await expect(page.getByText("NPX-4417", { exact: true }).first()).toBeVisible();
  });

  test("explains each batch's place in the queue", async ({ page }) => {
    await page.getByLabel("Find a medicine").fill("Seclo");
    await page.getByRole("button", { name: "Add one Seclo 20mg" }).click();

    const panel = page.getByRole("complementary");
    await expect(panel).toContainText("Oldest stock first");
    await expect(panel).toContainText("SEC-2210 expires first");
    await expect(panel).toContainText("Expired · blocked");
    await expect(panel).toContainText("SEC-1180");
  });

  test("expired stock can never reach the cart", async ({ page }) => {
    await page.getByLabel("Find a medicine").fill("Maxpro");

    const row = page.getByRole("list", { name: "Medicines" })
      .getByRole("listitem").filter({ hasText: "Maxpro 20mg" });
    await expect(row).toContainText("no sellable batch");
    await expect(row.getByRole("button", { name: /^Add one/ })).toBeDisabled();
  });

  test("the cart will not go past what is on the shelf", async ({ page }) => {
    await page.getByLabel("Find a medicine").fill("Ventolin");
    const add = page.getByRole("button", { name: "Add one Ventolin Inhaler" });

    for (let i = 0; i < 12; i++) await add.click();
    await expect(page.getByText("12 units · 1 line")).toBeVisible();

    await expect(add).toBeDisabled();

    await page.getByRole("button", { name: "Add one more Ventolin Inhaler" }).click();
    await expect(toast(page)).toContainText("Only 12 inhalers of VNT-0917 are on the shelf");
    await expect(page.getByText("12 units · 1 line")).toBeVisible();
  });

  test("quantity can be raised, lowered and the line removed", async ({ page }) => {
    await page.getByLabel("Find a medicine").fill("Napa");
    await page.getByRole("button", { name: `Add one ${NAPA}` }).click();

    await page.getByRole("button", { name: `Add one more ${NAPA}` }).click();
    await expect(page.getByText("2 units · 1 line")).toBeVisible();

    await page.getByRole("button", { name: `Take one ${NAPA} off` }).click();
    await page.getByRole("button", { name: `Remove ${NAPA} from the cart` }).click();
    await expect(page.getByText("The cart is empty")).toBeVisible();
  });

  test("the tab badge counts units waiting in the cart", async ({ page }) => {
    const tab = page.getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: /Counter sale/ });

    await page.getByLabel("Find a medicine").fill("Napa");
    await page.getByRole("button", { name: `Add one ${NAPA}` }).click();
    await expect(tab).toContainText("1 units in the cart");

    await page.getByRole("button", { name: `Add one more ${NAPA}` }).click();
    await expect(tab).toContainText("2 units in the cart");
  });

  test("completing a sale takes the stock down and numbers the invoice", async ({ page }) => {
    await page.getByLabel("Find a medicine").fill("Napa");
    await page.getByRole("button", { name: `Add one ${NAPA}` }).click();
    await page.getByRole("button", { name: "Complete sale" }).click();

    await expect(toast(page)).toContainText(/Sale recorded .* INV-\d+/);
    await expect(page.getByText("The cart is empty")).toBeVisible();

    await page.goto("/batches/NPX-4417");
    await expect(page.getByText("87 strips", { exact: true }).first()).toBeVisible();
  });

  test("a live discount follows the stock to the counter", async ({ page }) => {
    await page.goto("/batches/NPX-4417");
    await page.getByRole("button", { name: "20%", exact: true }).click();
    await page.getByRole("button", { name: /Apply 20% off/ }).click();

    await openTab(page, "Counter sale");
    await page.getByLabel("Find a medicine").fill("Napa");

    const row = page.getByRole("list", { name: "Medicines" })
      .getByRole("listitem").filter({ hasText: NAPA });
    await expect(row).toContainText("৳50.40");
  });

  test("clear cart empties it without recording anything", async ({ page }) => {
    await page.getByLabel("Find a medicine").fill("Napa");
    await page.getByRole("button", { name: `Add one ${NAPA}` }).click();

    await page.getByRole("button", { name: "Clear cart" }).click();
    await expect(page.getByText("The cart is empty")).toBeVisible();

    await page.goto("/batches/NPX-4417");
    await expect(page.getByText("88 strips", { exact: true }).first()).toBeVisible();
  });
});
