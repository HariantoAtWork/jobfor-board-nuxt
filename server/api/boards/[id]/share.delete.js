// DELETE /api/boards/[id]/share - Revoke share token for a board
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

    // Revoke share token
    const success = await boardDb.revokeShareToken(boardId, session.user.id)

    if (!success) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found - Board not found or access denied',
      })
    }

    return {
      success: true,
      message: 'Share token revoked successfully',
      data: {
        board_id: boardId,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error revoking share token:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to revoke share token',
      data: { error: error.message },
    })
  }
})
