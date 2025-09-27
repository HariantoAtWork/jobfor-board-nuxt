import { auth } from '../lib/auth.server'
// Constants
const SESSION_COOKIE_NAME = 'better-auth.session_token'
const USER_AGENT = 'JobFor-Board-Nuxt/1.0'
const DEFAULT_SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith('/api/auth')) return
  const baseUrl =
    process.env.BETTER_AUTH_PROXY_URL || process.env.BETTER_AUTH_URL
  if (baseUrl) {
    console.log('----- Better Auth Proxy')
    const path = event.node.req.url.replace('/api/auth', `${baseUrl}/api/auth`)
    const cookie = getCookie(event, 'better-auth.session_token')
    const cookies = parseCookies(event)
    console.log('----- COOKIES', cookies, cookie)
    if (!cookie) {
      console.log('----- NO COOKIE')
      return proxyRequest(event, path)
    }

    // if (
    //   event.node.req.method === 'POST' &&
    //   event.node.req.url?.startsWith('/api/auth/sign-out')
    // ) {
    //   console.log('----- SIGN OUT', { path })

    //   console.log('----- SIGN OUT PROXY REQUEST')
    //   console.log(getHeaders(event))
    //   return proxyRequest(event, path, {
    //     headers: {
    //       ...getHeaders(event),
    //       host: baseUrl,
    //       referer: baseUrl,
    //       origin: baseUrl,
    //     },
    //   })
    // }

    console.log('----- PROXY FORWARDING')
    // console.log(getHeaders(event))
    return proxyRequest(event, path, {
      headers: {
        // ...getHeaders(event),
        cookie: `${SESSION_COOKIE_NAME}=${cookie}`,
        'content-type': 'application/json',
        'user-agent': USER_AGENT,
        host: baseUrl,
        referer: baseUrl,
        origin: baseUrl,
      },
    })
  } else {
    console.log('----- Better Auth Local')
    return auth.handler(toWebRequest(event))
  }
})
