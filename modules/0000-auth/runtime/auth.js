import { auth } from '../lib/auth.server'

// Constants
const USER_AGENT = 'JobFor-Board-Nuxt/1.0'

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith('/api/auth')) return
  const baseUrl =
    process.env.BETTER_AUTH_PROXY_URL || process.env.BETTER_AUTH_URL
  if (baseUrl) {
    console.log('----- Better Auth: Proxy Mode')
    const path = event.node.req.url.replace('/api/auth', `${baseUrl}/api/auth`)
    return proxyRequest(event, path, {
      headers: {
        'user-agent': USER_AGENT,
        origin: baseUrl,
      },
    })
  } else {
    console.log('----- Better Auth: Local Mode')
    return auth.handler(toWebRequest(event))
  }
})
