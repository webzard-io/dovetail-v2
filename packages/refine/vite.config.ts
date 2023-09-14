import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      "/api": {
        target: "http://10.255.4.115",
        ws: true,
      },
    },
  },
});
