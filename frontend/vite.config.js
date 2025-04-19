import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Add server configuration
    proxy: {
      // Proxy API requests to the backend server
      '/api': {
        target: 'http://127.0.0.1:8000', // Your backend address
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix
      },
    },
  },
})
