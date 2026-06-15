import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Pin the dev server + HMR so the websocket URL is always well-formed.
  // Without an explicit hmr config, the client could fall back to
  // `ws://localhost:undefined` (invalid URL → blank page on a stale tab).
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 5173,
    },
  },

  build: {
    // Raise the chunk size warning threshold to 600 kB
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Vendor chunk split — keeps React/Router out of the app entry chunk
        // so the browser can cache them independently between deploys
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
