import { fileURLToPath } from 'node:url'
import getRouteRules from './lib/getRouteRules'

console.log(
  '--------------------------------',
  process.env.DB_TYPE,
  process.env.SQLITE_PATH
)
import checkEnvironmentVariables from './modules/0000-auth/lib/checkEnvironmentVariables.server'
checkEnvironmentVariables()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/styles/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    './modules/0000-auth',
    './modules/0001-boards',
  ],
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
  app: {
    head: {
      title: 'Job Application Organiser',
      meta: [
        {
          name: 'description',
          content:
            'A modern, full-stack job application organisation system built with Nuxt 4 and Vue 3. Organise your job applications through the entire hiring process using an intuitive Kanban-style board interface.',
        },
      ],
    },
  },
  ...getRouteRules(),
})
