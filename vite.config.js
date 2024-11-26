import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/qr_code': {
        target: 'http://20.84.153.108:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/qr_code/, '')
      }
    }
  }
})