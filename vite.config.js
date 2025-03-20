import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7021/',
        changeOrigin: true,
        secure: false, // Set to false if you're using a self-signed certificate
      },
    },
  },
  base:'/leslicensemanagementconsole/'
})
