import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5174,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      injectManifest: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
      },
      manifest: {
        name: "LRMB Field Ops",
        short_name: "LRMB Ops",
        description: "Field operations management for Luxury Rentals Miami Beach",
        theme_color: "#080E1A",
        background_color: "#080E1A",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
          { src: "icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "icons/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
