// GET /api/auth/status - Check if user is authenticated
export default defineEventHandler(async (event) => {
  try {
    // Get the authenticated user from the session
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
        timestamp: new Date().toISOString(),
      }
    }

    return {
      success: true,
      authenticated: true,
      message: 'User is authenticated',
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          emailVerified: session.user.emailVerified,
        },
        session: {
          id: session.session.id,
          expiresAt: session.session.expiresAt,
        },
      },
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
      timestamp: new Date().toISOString(),
    }
  }
})
