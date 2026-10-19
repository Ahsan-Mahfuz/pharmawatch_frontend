import { expect, test } from "./pharmacy";
import { openTab, signIn, signOut, toast } from "./helpers";

const waiting = (page: import("@playwright/test").Page) =>
  page.getByRole("list", { name: "Requests waiting for a decision" }).getByRole("listitem");

test.describe("the two person rule", () => {
  test("a pharmacist raises a return and cannot decide it; the owner can", async ({ page }) => {
    await signIn(page, "pharmacist");

    await page.goto("/batches/SEC-2210");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Seclo 20mg");

    await page.getByRole("button", { name: "Request supplier return" }).click();
    await expect(toast(page)).toContainText("Return requested for SEC-2210");

    await openTab(page, "Approvals");
    const row = waiting(page).filter({ hasText: "SEC-2210" });
    await expect(row).toContainText("Only the owner can decide this.");
    await expect(row.getByRole("button", { name: "Approve" })).toBeDisabled();
    await expect(row.getByRole("button", { name: "Reject" })).toBeDisabled();

    await signOut(page);
    await signIn(page, "owner");
    await openTab(page, "Approvals");

    const asOwner = waiting(page).filter({ hasText: "SEC-2210" });
    await expect(asOwner.getByRole("button", { name: "Approve" })).toBeEnabled();
    await asOwner.getByRole("button", { name: "Approve" }).click();
    await expect(toast(page)).toContainText("approved");

    await page.goto("/batches/SEC-2210");
    await expect(page.getByText("Returned").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Request supplier return" })).toBeDisabled();
  });

  test("nobody approves their own request, not even the owner", async ({ page }) => {
    await signIn(page, "owner");

    await page.goto("/batches/SEC-2210");
    await page.getByRole("button", { name: "Request supplier return" }).click();
    await expect(toast(page)).toContainText("Waiting on the owner");

    await openTab(page, "Approvals");
    const row = waiting(page).filter({ hasText: "SEC-2210" });
    await expect(row).toContainText("You raised this request, so someone else has to approve it.");
    await expect(row.getByRole("button", { name: "Approve" })).toBeDisabled();
  });

  test("one pending request per batch — asking twice changes nothing", async ({ page }) => {
    await signIn(page, "pharmacist");
    await page.goto("/batches/SEC-2210");

    await page.getByRole("button", { name: "Request supplier return" }).click();
    await expect(page.getByText("Return awaiting approval").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Request write-off" })).toBeDisabled();

    await openTab(page, "Approvals");
    await expect(waiting(page).filter({ hasText: "SEC-2210" })).toHaveCount(1);
  });

  test("a rejected request leaves the batch on the shelf", async ({ page }) => {
    await signIn(page, "owner");
    await openTab(page, "Approvals");

    const row = waiting(page).filter({ hasText: "MXP-3390" });
    await row.getByRole("button", { name: "Reject" }).click();
    await expect(toast(page)).toContainText("rejected");

    await page.goto("/batches/MXP-3390");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Maxpro 20mg");
    await expect(page.getByText("Expired").first()).toBeVisible();
  });

  test("an approved write-off empties the shelf and leaves the queue", async ({ page }) => {
    await signIn(page, "owner");
    await openTab(page, "Approvals");

    await waiting(page)
      .filter({ hasText: "MXP-3390" })
      .getByRole("button", { name: "Approve" })
      .click();
    await expect(toast(page)).toContainText("approved");
    await expect(waiting(page).filter({ hasText: "MXP-3390" })).toHaveCount(0);

    await page.goto("/batches/MXP-3390");
    await expect(page.getByText("Written off").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Request write-off" })).toBeDisabled();
  });
});

test.describe("acting on a batch", () => {
  test("a discount changes the counter price and can be changed again", async ({ page }) => {
    await signIn(page, "pharmacist");
    await page.goto("/batches/NPX-4417");

    await page.getByRole("button", { name: "25%", exact: true }).click();
    await page.getByRole("button", { name: /Apply 25% off/ }).click();
    await expect(toast(page)).toContainText("25% off is live on NPX-4417");
    await expect(page.getByText("Live now: 25% off")).toBeVisible();

    await page.getByRole("button", { name: "10%", exact: true }).click();
    await page.getByRole("button", { name: /Apply 10% off/ }).click();
    await expect(page.getByText("Live now: 10% off")).toBeVisible();
    await expect(page.getByText("Live now: 25% off")).toBeHidden();
  });

  test("the return button is closed once the window has passed", async ({ page }) => {
    await signIn(page, "pharmacist");
    await page.goto("/batches/VNT-0917");

    await expect(page.getByRole("button", { name: "Request supplier return" })).toBeDisabled();
    await expect(page.getByText(/The return window closed on/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Request write-off" })).toBeEnabled();
  });
});
