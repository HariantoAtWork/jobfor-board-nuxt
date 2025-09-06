// POST /api/boards/[id]/share - Generate share token for a board
export default defineEventHandler(async (event) => {
  try {
    // Get the authenticated user from the session
    const { getServerSession } = await import(
      '@modules/0000-auth/lib/session.server.js'
    )
    const session = await getServerSession(event)

    if (!session?.user?.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized - Please sign in',
      })
    }

    // Get board ID from route params
    const boardId = getRouterParam(event, 'id')

    if (!boardId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request - Board ID is required',
      })
    }

    const { boardDb } = await import(
      '@modules/0001-boards/lib/boards.server.js'
    )

    // Generate share token
    const shareToken = await boardDb.generateShareToken(
      boardId,
      session.user.id
    )

    if (!shareToken) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found - Board not found or access denied',
      })
    }

    return {
      success: true,
      message: 'Share token generated successfully',
      data: {
        share_token: shareToken,
        share_url: `${getRequestURL(event).origin}/shared/${shareToken}`,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error generating share token:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate share token',
      data: { error: error.message },
    })
  }
})
