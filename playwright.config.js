// @ts-check
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['allure-playwright', { outputFolder: 'allure-results' }],
    ['html', { open: 'never' }],
  ],

  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      testMatch: /regression\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.UI_URL,
      },
    },
    {
      name: 'api',
      testMatch: /reqres\.spec\.js/,
    },
    {
      name: 'firefox',
      testMatch: /regression\.spec\.js/,
      use: {
        ...devices['Desktop Firefox'],
        baseURL: process.env.UI_URL,
      },
    },
  ],
});
