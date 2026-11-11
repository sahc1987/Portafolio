import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-mobile', use: { ...devices['Pixel 7'] } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
  ],
  // Tests run against the real static export (npm run build), not the dev server.
  webServer: {
    command: 'node scripts/serve-out.mjs',
    port: PORT,
    reuseExistingServer: true,
    env: { PORT: String(PORT) },
  },
});
