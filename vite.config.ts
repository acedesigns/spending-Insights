/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 1997,
    strictPort: true, // Optional: forces Vite to exit if the port is already in use
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/main.tsx", "src/test/**", "**/*.d.ts"],
    },
  },
});
