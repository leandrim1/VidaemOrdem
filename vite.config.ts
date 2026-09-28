import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        // Separa bibliotecas estáveis em chunks próprios para melhorar o cache
        // entre deploys. Recharts só é baixado pelas páginas que usam gráficos.
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              priority: 30,
            },
            {
              name: 'charts',
              test: /[\\/]node_modules[\\/](recharts|d3-[^\\/]+|victory-vendor|internmap|decimal\.js-light|es-toolkit|eventemitter3|react-redux|@reduxjs|redux|reselect)[\\/]/,
              priority: 20,
            },
            {
              name: 'forms',
              test: /[\\/]node_modules[\\/](react-hook-form|@hookform|zod)[\\/]/,
              priority: 10,
            },
            {
              // Agrupa os ícones usados em um único chunk (evita dezenas de arquivos minúsculos).
              name: 'icons',
              test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
              priority: 10,
            },
            {
              name: 'date',
              test: /[\\/]node_modules[\\/]date-fns[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
})
