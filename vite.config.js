import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Läser .env. Tredje argumentet '' = alla variabler, inte bara VITE_*. De används bara
  // här, i Node – de hamnar aldrig i koden som skickas till browsern.
  const env = loadEnv(mode, process.cwd(), '')

  // /api → mock-API:t med nyckeln påsatt – samma jobb som nginx gör i containern
  const apiProxy = {
    '/api': {
      target: env.API_URL || 'http://localhost:4000',
      changeOrigin: true,
      headers: { 'X-Api-Key': env.API_KEY || '' },
    },
  }

  return {
    plugins: [vue()],
    server: { proxy: apiProxy },
    preview: { proxy: apiProxy },
    // config from a starter template, seems to work /M
    test: {
      environment: 'jsdom',
      include: ['src/**/*.test.js'],
    },
  }
})
