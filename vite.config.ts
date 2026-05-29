import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import dotenv from 'dotenv';

// Load environmental variables during build-time so they are successfully compiled into the SPA bundle
dotenv.config();

export default defineConfig(() => {
  const mapsKey = (
    process.env.GOOGLE_MAPS_PLATFORM_KEY || 
    process.env.GOOGLE_MAPS_API_KEY || 
    process.env.GOOGLE_MAPS_KEY || 
    process.env.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    process.env.MAPS_API_KEY ||
    ''
  ).trim();

  return {
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(mapsKey),
      'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(mapsKey),
      'process.env.GOOGLE_MAPS_KEY': JSON.stringify(mapsKey),
      'process.env.VITE_GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(mapsKey),
      'process.env.MAPS_API_KEY': JSON.stringify(mapsKey),
    },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
