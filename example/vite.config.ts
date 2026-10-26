import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'window',
    __DEV__: JSON.stringify(true),
    'process.env': {},
  },
  resolve: {
    alias: {
      'react-native': path.resolve(import.meta.dirname, 'node_modules/react-native-web'),
      'react-native-watch-face': path.resolve(import.meta.dirname, '../src/index.tsx'),
      'react-native-fs': path.resolve(import.meta.dirname, 'src/mockRNFS.ts'),
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
  },
});
