import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("react/") || id.includes("react-dom/") || id.includes("react-router-dom") || id.includes("react-router")) {
                return "react-vendor";
              }
              if (id.includes("motion") || id.includes("framer-motion")) {
                return "motion-vendor";
              }
              if (id.includes("lucide")) {
                return "lucide-vendor";
              }
              if (id.includes("embla-carousel")) {
                return "embla-vendor";
              }
              return "vendor";
            }
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
