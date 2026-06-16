import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  // Force IPv4 (127.0.0.1) for both HTTP and the HMR websocket.
  // On Windows, `localhost` can resolve to IPv6 (::1) for the websocket while
  // the dev server is reachable over IPv4 — the HMR socket then fails to
  // connect, Vite enters a "server connection lost → reload" loop, and the
  // page never finishes mounting (blank). Pinning to 127.0.0.1 + an explicit
  // clientPort keeps HTTP and the HMR socket on the same address/port.
  // Access the dev server at http://127.0.0.1:5173/.
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '127.0.0.1',
      protocol: 'ws',
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
