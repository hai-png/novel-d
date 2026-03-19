import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    return {
      // GitHub Pages deployment - change to '/' for root domain deployment
      base: '/novel-d/',
      
      server: {
        port: 3000,
        host: '0.0.0.0',
        hmr: {
          protocol: 'ws',
          host: 'localhost',
          port: 3000,
        },
      },
      
      plugins: [react()],
      
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, 'components'),
          '@hooks': path.resolve(__dirname, 'hooks'),
          '@utils': path.resolve(__dirname, 'utils'),
          '@types': path.resolve(__dirname, 'types'),
          '@src': path.resolve(__dirname, 'src'),
        }
      },
      
      publicDir: 'public',
      
      // Build optimizations for production
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'three-vendor': ['three'],
            },
          },
        },
      },
    };
});
