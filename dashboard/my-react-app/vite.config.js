import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    mimeTypes: {
      "application/javascript": ["js"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Backend server URL
        changeOrigin: true, // Change the origin of the host header to the target URL
        secure: false, // Set to false if you're not using HTTPS
         },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
