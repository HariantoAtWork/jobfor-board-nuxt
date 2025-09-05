// DELETE /api/boards/[id] - Delete a specific board
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

    // Get board ID from route parameters
    const boardId = getRouterParam(event, 'id')

    if (!boardId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request - board ID is required',
      })
    }

    const { boardDb } = await import(
      '@modules/0001-boards/lib/boards.server.js'
    )

    // Check if board exists and belongs to user
    const existingBoard = await boardDb.getBoardById(boardId, session.user.id)

    if (!existingBoard) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found',
      })
    }

    // Delete the board
    const deleted = await boardDb.deleteBoard(boardId, session.user.id)

    if (!deleted) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete board',
      })
    }

    return {
      success: true,
      message: 'Board deleted successfully',
      data: { id: boardId },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error deleting board:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete board',
      data: { error: error.message },
    })
  }
})
