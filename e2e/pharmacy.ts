import { test as base } from "@playwright/test";
import { API_URL } from "./api-url";

// One database serves the whole run, so every test starts from the seeded books.
export const test = base.extend<{ freshBooks: void }>({
  freshBooks: [
    async ({ request }, use) => {
      const response = await request.post(`${API_URL}/test/reseed`);
      if (!response.ok()) throw new Error(`Could not reseed the API: ${response.status()}`);
      await use();
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
