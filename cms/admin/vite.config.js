import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // In production the admin lives at /cms/ served by Cloudflare Pages.
  // In dev the Worker runs on :8787 — proxy /api/* so no CORS issues.
  base: '/cms/',
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
