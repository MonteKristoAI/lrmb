/**
 * Vite SSR build config — builds client/src/entry-server.tsx to dist/server-entry.js
 * Used only at build time for static HTML generation (prerendering).
 * This is NOT the production server — it's a build-time renderer.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    ssr: true,
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "client", "src", "entry-server.tsx"),
      output: {
        entryFileNames: "server-entry.js",
        format: "esm",
      },
    },
  },
  ssr: {
    // Externalize node built-ins but bundle everything else
    noExternal: ["react-helmet-async", "wouter", "framer-motion"],
  },
});
