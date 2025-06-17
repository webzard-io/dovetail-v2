import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import pkg from './package.json';
import linaria from './tools/linaria';

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

export default defineConfig({
  plugins: [
    commonjs(),
    react(),
    linaria({
      preprocessor: 'none',
      extension: 'scss'
    }),
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
        target: process.env.API_HOST || 'http://192.168.30.67',
        ws: true,
        headers: {
          'Accept-Encoding': 'identity',
          'Authorization': process.env.REACT_APP_DEV_TOKEN,
          'Cookie': process.env.REACT_APP_DEV_COOKIE,
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
          'Accept-Encoding': 'identity',
          'Authorization': process.env.REACT_APP_DEV_TOKEN,
          'Cookie': process.env.REACT_APP_DEV_COOKIE,
        },
        secure: false,
      },
    },
  },
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'dovetail',
    },
    rollupOptions: {
      external,
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@cloudtower/eagle/dist/variables.scss";\r\n'
      }
    }
  }
});
