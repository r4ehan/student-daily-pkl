import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "icon-192.png",
        "icon-512.png",
      ],
      manifest: {
        name: "Student Daily PKL",
        short_name: "Daily PKL",
        description: "Aplikasi pencatatan kegiatan PKL untuk pelajar SMK",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any", // untuk general use
          },
          {
            src: "/icon-512-maskable.png", // versi khusus maskable
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable", // untuk OS yang support masking
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  // TAMBAHKAN BAGIAN INI UNTUK CODE SPLITTING
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "supabase-vendor": ["@supabase/supabase-js"],
          "chart-vendor": ["recharts"],
          "pdf-vendor": ["jspdf", "jspdf-autotable", "html2canvas"],
          "icon-vendor": ["lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Naikkan batas warning agar tidak muncul lagi
  },
  server: { port: 5173 },
});
