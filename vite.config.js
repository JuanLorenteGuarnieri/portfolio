import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/portfolio/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor'
            }
            if (
              id.includes('react-dom') ||
              id.includes('react-router-dom') ||
              id.includes('react') ||
              id.includes('scheduler')
            ) {
              return 'react-vendor'
            }
            if (id.includes('@emailjs')) {
              return 'emailjs-vendor'
            }
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})