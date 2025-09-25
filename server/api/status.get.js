// GET /api/status - Check if user is authenticated (works with proxy)
export default defineEventHandler(async (event) => {
  const authMode = process.env.BETTER_AUTH_PROXY_URL ? 'proxy' : 'local'

  try {
    // Get the authenticated user from the session (now supports proxy)
    const { getServerSession } = await import(
      '@modules/0000-auth/lib/session.server.js'
    )
    const session = await getServerSession(event)

    if (!session?.user?.id) {
      return {
        success: true,
        authenticated: false,
        message: 'User is not authenticated',
        data: null,
        authMode,
        timestamp: new Date().toISOString(),
      }
    }

    return {
      success: true,
      authenticated: true,
      message: 'User is authenticated',
      data: session,
      authMode,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error checking auth status:', error)

    return {
      success: false,
      authenticated: false,
      message: 'Error checking authentication status',
      data: null,
      error: error.message,
      authMode,
      timestamp: new Date().toISOString(),
    }
  }
})
