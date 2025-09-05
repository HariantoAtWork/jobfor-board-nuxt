// GET /api/boards/[id] - Get a specific board by ID
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

    const { boardDb } = await import('@modules/0000-auth/lib/boards.server.js')

    // Get the board
    const board = await boardDb.getBoardById(boardId, session.user.id)

    if (!board) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found',
      })
    }

    return {
      success: true,
      message: 'Board retrieved successfully',
      data: board,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error retrieving board:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve board',
      data: { error: error.message },
    })
  }
})
