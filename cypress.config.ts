import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3002",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  env: {
    baseUrl: "http://localhost:3002",
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
