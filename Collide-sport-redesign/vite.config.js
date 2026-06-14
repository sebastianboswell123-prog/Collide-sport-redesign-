import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

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
