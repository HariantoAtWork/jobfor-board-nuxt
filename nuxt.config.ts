import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  tailwindcss: {
    cssPath: '~/assets/styles/main.css',
    configPath: 'tailwind.config.js',
  },
  alias: {
    '@modules': fileURLToPath(new URL('./modules', import.meta.url)),
  },
})