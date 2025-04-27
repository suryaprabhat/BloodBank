import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  optimizeDeps: {
    exclude: ['@arcgis/core'], // 🚫 Tell Vite to ignore pre-optimizing ArcGIS
  },
  define: {
    'process.env': {}, // 👈 Required for ArcGIS (it uses env references)
  },
});
