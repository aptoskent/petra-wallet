import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();
const isCI = Boolean(process.env.CI);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  /* Maximum time one test can run for. */
  timeout: 45 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000
  },
  /* Run tests in files in parallel. */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Petra Wallet Extension',
      testDir: './apps/extension/e2e',
      testMatch: /.*\.e2e\.tsx?/,
      use: {
        ...devices['Desktop Chrome'],
        // Chrome Extensions can only be tested in non-headless mode.
        headless: false,
        // Many tests rely on the clipboard.
        permissions: ['clipboard-read', 'clipboard-write'],
      },
    },
  ],
};

export default config;
