import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'BibleUp - Conteúdos Bíblicos Educativos',
        short_name: 'BibleUp',
        description: 'Aplicativo web para professores, pais e líderes cristãos acessarem conteúdos bíblicos educativos',
        theme_color: '#72008c',
        background_color: '#72008c',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: [
          '**/*.{html,css,ico,png,svg}', // Somente arquivos essenciais
          'assets/index-*.js'            // Apenas JS inicial
        ],
        globIgnores: [
          '**/LessonDetail-*.js',
          '**/Profile-*.js',
          '**/Users-*.js',
          '**/Dashboard-*.js'
        ],
        runtimeCaching: [
          {
            urlPattern: /.*\.(?:js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dynamic-js-css',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } // 7 dias
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['@react-pdf/renderer']
  }
});
