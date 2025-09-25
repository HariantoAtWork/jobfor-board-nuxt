/**
 * Session forwarding for proxy authentication
 * Fetches session data from external auth server and makes it available locally
 */

export async function getProxiedSession(event) {
  try {
    // Check if we're using a proxy
    const proxyUrl = process.env.BETTER_AUTH_PROXY_URL
    if (!proxyUrl) {
      return null
    }

    // Get the session cookie from the request
    const cookies = getCookie(event, 'better-auth.session_token')
    if (!cookies) {
      return null
    }

    // Forward the request to the external auth server
    const response = await fetch(`${proxyUrl}/api/auth/get-session`, {
      method: 'GET',
      headers: {
        Cookie: `better-auth.session_token=${cookies}`,
        'Content-Type': 'application/json',
        'User-Agent': 'JobFor-Board-Nuxt/1.0',
      },
    })

    if (!response.ok) {
      console.warn('Failed to fetch session from proxy:', response.status)
      return null
    }

    const sessionData = await response.json()

    // Return the session in the format expected by your local code
    // Better Auth getSession returns { user, session } structure
    if (sessionData?.user) {
      return {
        user: {
          id: sessionData.user.id,
          email: sessionData.user.email,
          name: sessionData.user.name,
          emailVerified: sessionData.user.emailVerified,
        },
        session: {
          id: sessionData.session?.id || 'proxied-session',
          expiresAt:
            sessionData.session?.expiresAt ||
            new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching proxied session:', error)
    return null
  }
}

/**
 * Enhanced session getter that works with both local and proxied auth
 */
export async function getServerSession(event) {
  try {
    // First try to get proxied session
    const proxiedSession = await getProxiedSession(event)
    if (proxiedSession) {
      return proxiedSession
    }

    // Fallback to local auth if no proxy or proxy fails
    const { auth } = await import('./auth.server.js')
    const session = await auth.api.getSession({
      headers: getHeaders(event),
    })

    return session
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}
