import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["b72d-2402-e280-225c-266-fdc9-84be-9a88-1cb2.ngrok-free.app"], // Add your host here
  },
})
