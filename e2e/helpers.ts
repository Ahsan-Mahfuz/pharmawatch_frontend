import { expect, type Page } from "@playwright/test";

export const PASSWORD = "Pharma@2026";

export const PEOPLE = {
  pharmacist: { email: "rafiq@pharmawatch.test", first: "Rafiq" },
  owner: { email: "owner@pharmawatch.test", first: "Mahmuda" },
} as const;

type Who = keyof typeof PEOPLE;

export async function signIn(page: Page, who: Who = "pharmacist") {
  await page.goto("/signin");
  await page.getByLabel("Email").fill(PEOPLE[who].email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "may expire unsold",
  );
  await expect(
    page.locator("header").getByText(PEOPLE[who].first, { exact: true }),
  ).toBeVisible();
}

export async function signOut(page: Page) {
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/signin/);
}

export async function openTab(page: Page, label: string) {
  await page.getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: new RegExp(label) })
    .click();
}

export const toast = (page: Page) => page.getByRole("status").first();

export const banner = (page: Page) => page.getByRole("main").getByRole("alert").first();
