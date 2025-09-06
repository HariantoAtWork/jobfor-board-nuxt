// PUT /api/boards/[id]/public - Toggle public access for a board
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

    // Parse request body
    const body = await readBody(event)

    if (typeof body.is_public !== 'boolean') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request - is_public must be a boolean',
      })
    }

    const { boardDb } = await import(
      '@modules/0001-boards/lib/boards.server.js'
    )

    // Update public access
    const success = await boardDb.updateBoard(boardId, session.user.id, {
      is_public: body.is_public,
    })

    if (!success) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found - Board not found or access denied',
      })
    }

    // If making public and no share token exists, generate one
    if (body.is_public) {
      const board = await boardDb.getBoardById(boardId, session.user.id)
      if (board && !board.share_token) {
        await boardDb.generateShareToken(boardId, session.user.id)
      }
    }

    return {
      success: true,
      message: `Board ${
        body.is_public ? 'made public' : 'made private'
      } successfully`,
      data: {
        board_id: boardId,
        is_public: body.is_public,
      },
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error updating board public access:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update board public access',
      data: { error: error.message },
    })
  }
})
