import path from 'path';
import linaria from '@linaria/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';

export default defineConfig({
  plugins: [
    commonjs(),
    react(),
    linaria(),
  ],
  optimizeDeps: {
    exclude: ['monaco-yaml/yaml.worker.js']
  },
  logLevel: 'info',
  server: {
    host: '0.0.0.0',
    proxy: {
      // '/proxy-k8s': getProxyConfig(),
      '/api': {
        target: process.env.API_HOST || 'http://192.168.27.59',
        ws: true,
        headers: {
          'x-skip-auth-verify': 'true',
          'Accept-Encoding': 'identity'
        },
        secure: false,
      },
      '/exec-proxy': {
        target: process.env.API_HOST || 'https://10.255.110.22:30080',
        rewrite(path) {
          return path.replace('/exec-proxy', '');
        },
        ws: true,
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4IiwiaWF0IjoxNzE3NDk0OTIxfQ.GPW3AWxK1zqirbCP4OQJZ4VoDmLXLLgDjR_EjFcsqHQ',
        },
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ['monaco-yaml/yaml.worker.js']
  },
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'dovetail',
    },
    rollupOptions: {
      external: [
        '@cloudtower/eagle',
        '@cloudtower/icons-react',
        '@refinedev/core',
        '@refinedev/inferencer',
        'antd',
        'i18next',
        'ky',
        'lodash-es',
        'mitt',
        'qs',
        'react',
        'react-dom',
        'react-router-dom',
        'sunflower-antd',
        'monaco-editor',
        'monaco-yaml',
        'js-yaml',
        'k8s-api-provider',
      ],
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
});
