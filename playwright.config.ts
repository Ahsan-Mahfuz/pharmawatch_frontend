import { defineConfig, devices } from "@playwright/test";
import { API_URL } from "./e2e/api-url";

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

const API_PORT = new URL(API_URL).port;

export default defineConfig({
  testDir: "./e2e",
  // One API and one database back the whole suite, so the tests take turns
  // and each one reseeds before it runs.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],

  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /responsive\.spec\.ts/,
    },
    { name: "phone", use: { ...devices["Pixel 7"] }, testMatch: /responsive\.spec\.ts/ },
  ],

  webServer: [
    {
      // Never reuse: a running `pnpm dev` would answer /health, and the suite
      // would then reseed and rewrite the development database.
      command: `pnpm --dir ../pharmawatch_backend run e2e:api`,
      env: { PORT: API_PORT },
      url: `${API_URL}/health`,
      reuseExistingServer: false,
      timeout: 240_000,
      stdout: "pipe",
    },
    {
      command: `pnpm exec next start --port ${PORT}`,
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      stdout: "pipe",
    },
  ],
});
