// GET /api/proxy/debug-session - Debug session information
export default defineEventHandler(async (event) => {
  try {
    console.log('=== DEBUG SESSION ===')

    // Get all headers
    const headers = getHeaders(event)
    console.log('All headers:', headers)

    // Get cookies
    const sessionCookie = getCookie(event, 'better-auth.session_token')
    const allCookies = getCookie(event)
    console.log('Session cookie:', sessionCookie)
    console.log('All cookies:', allCookies)

    // Try to get session from session forwarding
    const { getServerSession } = await import(
      '@modules/0000-auth/lib/sessionForwarding.server.js'
    )
    const session = await getServerSession(event)
    console.log('Session data:', session)

    // Try to get session from external server directly
    const { BETTER_AUTH_PROXY_URL } = process.env
    let externalSession = null
    if (BETTER_AUTH_PROXY_URL && sessionCookie) {
      try {
        const response = await fetch(
          `${BETTER_AUTH_PROXY_URL}/api/auth/get-session`,
          {
            method: 'GET',
            headers: {
              Cookie: `better-auth.session_token=${sessionCookie}`,
              'Content-Type': 'application/json',
              'User-Agent': 'JobFor-Board-Nuxt/1.0',
            },
          }
        )

        if (response.ok) {
          externalSession = await response.json()
          console.log('External session:', externalSession)
        } else {
          console.log(
            'External session failed:',
            response.status,
            response.statusText
          )
        }
      } catch (error) {
        console.log('External session error:', error.message)
      }
    }

    return {
      success: true,
      debug: {
        headers: headers,
        cookies: {
          session: sessionCookie,
          all: allCookies,
        },
        localSession: session,
        externalSession: externalSession,
        proxyUrl: BETTER_AUTH_PROXY_URL,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Debug session error:', error)
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})
