import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // In dev, all /api calls proxy to the aggregator
      '/api': {
        target: 'http://aggregator-service:4000',
        changeOrigin: true,
      },
    },
  },
});
