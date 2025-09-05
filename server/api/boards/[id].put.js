// PUT /api/boards/[id] - Update a specific board
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

    // Parse request body
    const body = await readBody(event)

    if (!body.title && !body.data) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Bad Request - at least one field (title or data) is required',
      })
    }

    // Validate board data structure if provided
    if (
      body.data &&
      (!body.data.id ||
        !Array.isArray(body.data.columns) ||
        !Array.isArray(body.data.cards))
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request - invalid board data structure',
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

    // Update the board
    const updated = await boardDb.updateBoard(boardId, session.user.id, body)

    if (!updated) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update board',
      })
    }

    // Get the updated board
    const updatedBoard = await boardDb.getBoardById(boardId, session.user.id)

    return {
      success: true,
      message: 'Board updated successfully',
      data: updatedBoard,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error updating board:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update board',
      data: { error: error.message },
    })
  }
})
