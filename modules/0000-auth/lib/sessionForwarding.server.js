/**
 * Session forwarding for proxy authentication
 * Fetches session data from external auth server and makes it available locally
 */

// Constants
const SESSION_COOKIE_NAME = 'better-auth.session_token'
const USER_AGENT = 'JobFor-Board-Nuxt/1.0'
const DEFAULT_SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Get the proxy URL from environment variables
 */
function getProxyUrl() {
  const { BETTER_AUTH_URL, BETTER_AUTH_PROXY_URL } = process.env
  return BETTER_AUTH_URL || BETTER_AUTH_PROXY_URL
}

/**
 * Create default session expiry date
 */
function createDefaultExpiry() {
  return new Date(Date.now() + DEFAULT_SESSION_DURATION).toISOString()
}

/**
 * Normalise session data from proxy response
 */
function normaliseSessionData(sessionData) {
  if (!sessionData?.user) {
    return null
  }

  return {
    user: {
      id: sessionData.user.id,
      email: sessionData.user.email,
      name: sessionData.user.name,
      emailVerified: sessionData.user.emailVerified,
    },
    session: {
      id: sessionData.session?.id || 'proxied-session',
      expiresAt: sessionData.session?.expiresAt || createDefaultExpiry(),
    },
  }
}

/**
 * Fetch session from proxy server
 */
async function fetchProxySession(proxyUrl, sessionToken) {
  const response = await fetch(`${proxyUrl}/api/auth/get-session`, {
    method: 'GET',
    headers: {
      Cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`,
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Proxy session fetch failed: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

export async function getProxiedSession(event) {
  try {
    const proxyUrl = getProxyUrl()
    if (!proxyUrl) {
      return null
    }

    const sessionToken = getCookie(event, SESSION_COOKIE_NAME)
    if (!sessionToken) {
      return null
    }

    const sessionData = await fetchProxySession(proxyUrl, sessionToken)
    return normaliseSessionData(sessionData)
  } catch (error) {
    console.error('Error fetching proxied session:', error.message)
    return null
  }
}

/**
 * Sign out from proxy server
 */
async function signOutFromProxy(proxyUrl, sessionToken) {
  const response = await fetch(`${proxyUrl}/api/auth/sign-out`, {
    method: 'POST',
    headers: {
      cookie: `${SESSION_COOKIE_NAME}=${sessionToken}`,
      'content-type': 'application/json',
      'user-agent': USER_AGENT,
    },
    body: JSON.stringify({}),
  })

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => 'Could not read error response')
    throw new Error(
      `Proxy sign-out failed: ${response.status} ${response.statusText} - ${errorText}`
    )
  }

  return {
    success: true,
    message: 'Successfully signed out from proxy server.',
  }
}

/**
 * Sign out using local auth
 */
async function signOutLocally(event) {
  const { auth } = await import('./auth.server.js')
  return await auth.api.signOut({
    headers: getHeaders(event),
  })
}

/**
 * Server-side logout that works with both local and proxied auth
 */
export async function signOut(event) {
  try {
    const proxyUrl = getProxyUrl()

    if (proxyUrl) {
      const sessionToken = getCookie(event, SESSION_COOKIE_NAME)
      if (!sessionToken) {
        console.warn('No session token found for proxy sign-out')
        return { success: false, error: 'No session token found' }
      }

      console.log('Signing out from proxy server')
      return await signOutFromProxy(proxyUrl, sessionToken)
    } else {
      console.log('Signing out using local auth')
      return await signOutLocally(event)
    }
  } catch (error) {
    console.error('Error during sign out:', error.message)
    return { success: false, error: error.message }
  }
}

/**
 * Get session using local auth
 */
async function getLocalSession(event) {
  const { auth } = await import('./auth.server.js')
  return await auth.api.getSession({
    headers: getHeaders(event),
  })
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
    return await getLocalSession(event)
  } catch (error) {
    console.error('Error getting server session:', error.message)
    return null
  }
}
