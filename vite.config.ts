import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/palmkeys-web/', // GitHub Pages base path
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'PalmKeys Web',
        short_name: 'PalmKeys',
        description: 'Virtual keyboard using hand tracking',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/palmkeys-web/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        display: 'standalone',
        orientation: 'landscape'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  server: {
    https: true,
    proxy: {
      '/cdn': {
        target: 'https://cdn.jsdelivr.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cdn/, '')
      }
    }
  }
}) 