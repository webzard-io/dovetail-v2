import path from 'path';
import linaria from '@linaria/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), linaria()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://10.255.4.115',
        ws: true,
        headers: {
          'x-skip-auth-verify': 'true',
        },
      },
    },
  },
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'dovetail',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'mjs' : 'js'}`,
      formats: ['es', 'cjs'],
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
      ],
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
});
