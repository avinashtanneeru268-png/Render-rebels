import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    testTimeout: 15000,
  },
  resolve: {
    alias: {
      "@sitesentinel/shared": path.resolve(__dirname, "./shared/src/index.ts"),
    },
  },
});
