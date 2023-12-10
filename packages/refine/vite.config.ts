import path from 'path';
import linaria from '@linaria/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  plugins: [commonjs(), react(), linaria()],
  server: {
    force: true,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: process.env.API_HOST || 'http://10.255.4.115',
        ws: true,
        headers: {
          'x-skip-auth-verify': 'true',
        },
      },
    },
  },
  base: './',
  // build: {
  //   minify: false,
  //   lib: {
  //     entry: path.resolve(__dirname, 'src/index.ts'),
  //     name: 'dovetail',
  //   },
  //   rollupOptions: {
  //     external: [
  //       '@cloudtower/eagle',
  //       '@cloudtower/icons-react',
  //       '@refinedev/core',
  //       '@refinedev/inferencer',
  //       'antd',
  //       'i18next',
  //       'ky',
  //       'lodash-es',
  //       'mitt',
  //       'qs',
  //       'react',
  //       'react-dom',
  //       'react-router-dom',
  //       'sunflower-antd',
  //       'monaco-editor',
  //       'monaco-yaml',
  //       'js-yaml',
  //       'k8s-api-provider',
  //     ],
  //   },
  // },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
});
