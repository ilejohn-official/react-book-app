import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxy API requests during development to Django backend
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/react-book-app',
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
