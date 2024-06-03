const { defineConfig } = require("cypress");
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({
  e2e: {
    specPattern: "**/*.cy.js",
    watchForFileChanges: false,
    baseUrl: "https://hr-challenge.dev.tapyou.com",
    setupNodeEvents(on, config) {
      allureCypress(on, {
        resultsDir: "./allure-results",
      });
      return config;
    },
  },
});
