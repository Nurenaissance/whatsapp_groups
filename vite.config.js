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
      '/qr_code/get_qr': {
        target: 'http://20.84.153.108:8000',
        changeOrigin: true,
      },
      '/tracking/start': {
        target: 'http://20.84.153.108:8000',
        changeOrigin: true,
      }
    }
  }
})