import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',      // “追加しますか？”バナーを手動表示
      injectRegister: 'auto',      // index.html に自動注入
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Eiken Vocab Viewer',
        short_name: 'Eiken Vocab',
        description: '1,240-word Eiken Grade-1 list with search & examples',
        theme_color: '#0f172a',    // Tailwind slate-900
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,mp3,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'StaleWhileRevalidate'
          },
          {
            urlPattern: ({ request }) => request.destination === 'audio',
            handler: 'CacheFirst',
            options: { cacheName: 'audio-cache', expiration: { maxEntries: 1200 } }
          }
        ]
      }
    })
  ]
})
