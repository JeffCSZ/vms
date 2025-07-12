import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
// VMS_tenant - Working IIS deployment configuration (Dec 2024)
export default defineConfig({
  plugins: [react()],
  base: "./", // Use relative paths for assets - fixes remote access
  build: {
    assetsDir: "assets",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
