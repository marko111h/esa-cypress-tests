const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://practicesoftwaretesting.com",
    viewportWidth: 1440,
    viewportHeight: 900,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 1,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    // Default test user (provided by practicesoftwaretesting.com)
    CUSTOMER_EMAIL: "customer@practicesoftwaretesting.com",
    CUSTOMER_PASSWORD: "welcome01",
  },
});
