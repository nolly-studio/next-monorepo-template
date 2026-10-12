import { defineConfig, devices } from "@playwright/test";

const isCI = process.env.CI === "true";

export default defineConfig({
  forbidOnly: isCI,
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: isCI ? "github" : "list",
  retries: isCI ? 1 : 0,
  testDir: "e2e",
  testMatch: "**/*.e2e.ts",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun run --filter web start",
    reuseExistingServer: !isCI,
    timeout: 120_000,
    url: "http://127.0.0.1:3000",
  },
  workers: isCI ? 1 : undefined,
});
