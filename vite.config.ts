import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/print_kiosk_go/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
