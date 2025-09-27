// POST /api/auth/logout - Server-side logout (works with proxy)
export default defineEventHandler(async (event) => {
  console.log('----- logout')
  try {
    // Import the signOut function from session forwarding
    const { signOut } = await import(
      '@modules/0000-auth/lib/sessionForwarding.server.js'
    )

    // Perform server-side logout
    const result = await signOut(event)

    if (result.success) {
      return {
        success: true,
        message: result.message || 'Successfully signed out',
        timestamp: new Date().toISOString(),
      }
    } else {
      return {
        success: false,
        message: 'Failed to sign out',
        error: result.error,
        timestamp: new Date().toISOString(),
      }
    }
  } catch (error) {
    console.error('Error during logout:', error)

    return {
      success: false,
      message: 'Error during logout',
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})
