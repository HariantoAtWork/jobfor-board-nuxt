// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import { defineNuxtModule, createResolver, addServerHandler } from 'nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'module-auth',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    // Add an API route
    addServerHandler({
      route: '/api/auth/**',
      handler: resolver.resolve('./runtime/auth'),
    })
  },
})
