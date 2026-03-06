import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/absen-perpus/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: 'index.html',
      },
      manifest: {
        name: 'Perpus Absen — Politeknik KP Sorong',
        short_name: 'Perpus Absen',
        description: 'Sistem Absensi Pengunjung Perpustakaan',
        theme_color: '#0077B6',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/absen-perpus/',
        scope: '/absen-perpus/',
        icons: [
          { src: '/absen-perpus/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/absen-perpus/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
