import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/history": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/send": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      "/reset": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});