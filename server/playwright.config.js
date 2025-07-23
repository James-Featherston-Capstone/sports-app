import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    headless: false,
    launchOptions: {
      slowMo: 200,
    },
  },
});
