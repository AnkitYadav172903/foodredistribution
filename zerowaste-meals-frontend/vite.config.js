import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) {
              return 'charts'
            }
            if (id.includes('react') || id.includes('scheduler')) {
              return 'react-vendor'
            }
            return 'vendor'
          }
          return undefined
        },
      },
    },
  },
})