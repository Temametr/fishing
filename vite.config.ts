import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'FishMaster PRO',
        short_name: 'FishMaster',
        theme_color: '#0f172a',
        display: 'standalone',
        background_color: '#0f172a'
      }
    })
  ],
  base: '/fishing/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
