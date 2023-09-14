import * as path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "dovetail",
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "semver",
        "monaco-editor",
        "monaco-yaml",
        "@cloudtower/eagle",
        "antd"
      ],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      "/api": {
        target: "http://10.255.4.115",
        ws: true,
      },
    },
  },
  plugins: [
    tsconfigPaths(),
    react(),
    monacoEditorPlugin({
      languageWorkers: ["json", "editorWorkerService"],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
