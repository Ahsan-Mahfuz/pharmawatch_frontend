import { expect, test } from "./pharmacy";
import { PASSWORD, PEOPLE, banner, signIn, signOut } from "./helpers";

test.describe("the door", () => {
  test("a signed out visitor is sent to sign in and returned to where they asked for", async ({ page }) => {
    await page.goto("/reports");
    await expect(page).toHaveURL(/\/signin\?next=%2Freports/);

    await page.getByLabel("Email").fill(PEOPLE.owner.email);
    await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/reports$/);
    await expect(page.getByRole("heading", { name: "Reports" })).toBeVisible();
  });

  test("a wrong password says nothing about whether the account exists", async ({ page }) => {
    await page.goto("/signin");
    await page.getByLabel("Email").fill(PEOPLE.owner.email);
    await page.getByLabel("Password", { exact: true }).fill("NotThePassword1");
    await page.getByRole("button", { name: "Sign in" }).click();

    const known = await banner(page).textContent();

    await page.getByLabel("Email").fill("nobody@nowhere.test");
    await page.getByLabel("Password", { exact: true }).fill("NotThePassword1");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(banner(page)).toHaveText(known ?? "");
    await expect(page).toHaveURL(/\/signin/);
  });

  test("the password can be revealed, because mistyping it is the usual failure", async ({ page }) => {
    await page.goto("/signin");
    const field = page.getByLabel("Password", { exact: true });
    await field.fill(PASSWORD);

    await expect(field).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show" }).click();
    await expect(field).toHaveAttribute("type", "text");
  });

  test("signing out clears the session, and going back does not get you in", async ({ page }) => {
    await signIn(page, "owner");
    await signOut(page);

    await page.goto("/approvals");
    await expect(page).toHaveURL(/\/signin/);
  });

  test("a session survives a reload", async ({ page }) => {
    await signIn(page, "pharmacist");
    await page.reload();

    await expect(page.getByRole("heading", { level: 1 })).toContainText("may expire unsold");
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("signing up", () => {
  test("the policy is enforced before anything is sent", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Your name").fill("Nusrat Jahan");
    await page.getByLabel("Pharmacy name").fill("Zindabazar Pharmacy");
    await page.getByLabel("Email").fill("nusrat@example.test");
    await page.getByLabel("Password", { exact: true }).fill("password123");
    await page.getByLabel("Confirm password").fill("password123");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Create the account" }).click();

    await expect(page).toHaveURL(/\/signup/);
    await expect(banner(page)).toBeVisible();
  });

  test("the meter ticks the rules off as they are met", async ({ page }) => {
    await page.goto("/signup");
    const rule = page.getByText("At least 10 characters");
    await expect(rule).toBeVisible();

    await page.getByLabel("Password", { exact: true }).fill("Shahjalal2026");
    await expect(page.getByText("Good", { exact: true })).toBeVisible();

    await page.getByLabel("Password", { exact: true }).fill("Shahjalal2026!extra");
    await expect(page.getByText("Strong", { exact: true })).toBeVisible();
  });

  test("a mismatch is reported on the confirm box, not the password", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Your name").fill("Nusrat Jahan");
    await page.getByLabel("Pharmacy name").fill("Zindabazar Pharmacy");
    await page.getByLabel("Email").fill("nusrat@example.test");
    await page.getByLabel("Password", { exact: true }).fill("Shahjalal2026");
    await page.getByLabel("Confirm password").fill("Shahjalal2027");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Create the account" }).click();

    await expect(page.getByText("The two passwords do not match")).toBeVisible();
  });

  test("a complete account is created and lands signed in", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Your name").fill("Nusrat Jahan");
    await page.getByLabel("Pharmacy name").fill("Zindabazar Pharmacy");
    await page.getByLabel("Email").fill("nusrat@example.test");
    await page.getByLabel("Password", { exact: true }).fill("Shahjalal2026");
    await page.getByLabel("Confirm password").fill("Shahjalal2026");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Create the account" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText("may expire unsold");
    await expect(page.getByText("Nusrat", { exact: true })).toBeVisible();
  });
});

test.describe("forgetting the password", () => {
  test("an unknown address is answered exactly like a known one", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill("nobody@nowhere.test");
    await page.getByRole("button", { name: "Send the reset link" }).click();
    await expect(page.getByRole("status")).toContainText("is on its way");
  });

  test("the whole reset round trip: request, set, sign in with the new password", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(PEOPLE.pharmacist.email);
    await page.getByRole("button", { name: "Send the reset link" }).click();

    await page.getByRole("link", { name: "open the reset link" }).click();
    await expect(page.getByRole("heading", { name: "Choose a new password" })).toBeVisible();

    await page.getByLabel("New password", { exact: true }).fill("Zindabazar2027");
    await page.getByLabel("Confirm new password").fill("Zindabazar2027");
    await page.getByRole("button", { name: "Change the password" }).click();
    await expect(page.getByRole("status")).toContainText("has been changed");

    await page.getByRole("link", { name: "Sign in with the new password" }).click();
    await page.getByLabel("Email").fill(PEOPLE.pharmacist.email);
    await page.getByLabel("Password", { exact: true }).fill("Zindabazar2027");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toContainText("may expire unsold");
  });

  test("a reset link works once", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.getByLabel("Email").fill(PEOPLE.owner.email);
    await page.getByRole("button", { name: "Send the reset link" }).click();

    const link = page.getByRole("link", { name: "open the reset link" });
    const href = await link.getAttribute("href");
    await link.click();

    await page.getByLabel("New password", { exact: true }).fill("Zindabazar2027");
    await page.getByLabel("Confirm new password").fill("Zindabazar2027");
    await page.getByRole("button", { name: "Change the password" }).click();
    await expect(page.getByRole("status")).toContainText("has been changed");

    await page.goto(href!);
    await page.getByLabel("New password", { exact: true }).fill("Something3Else");
    await page.getByLabel("Confirm new password").fill("Something3Else");
    await page.getByRole("button", { name: "Change the password" }).click();
    await expect(banner(page)).toContainText("expired");
  });

  test("a link with no token refuses to pretend", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(banner(page)).toContainText("incomplete");
    await expect(page.getByRole("link", { name: "Request a new link" })).toBeVisible();
  });
});
