import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', './modules/0000-auth', './modules/0001-boards'],
  tailwindcss: {
    cssPath: '~/assets/styles/main.css',
    configPath: 'tailwind.config.js',
  },
  alias: {
    '@modules': fileURLToPath(new URL('./modules', import.meta.url)),
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
})