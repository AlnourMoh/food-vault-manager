
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        // تعريف المكتبات الخارجية بشكل صحيح
        "next-themes",
        "@capacitor/device",
        "@capacitor/app",
        "@capacitor/core",
        "@capacitor/toast",
        "@capacitor-mlkit/barcode-scanning",
        "@capacitor/camera",
        "@capacitor/browser"
      ],
    },
    // تحسين بناء المشروع
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
  },
}));
