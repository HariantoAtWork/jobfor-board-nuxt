// GET /api/shared/[token] - Get a shared board by token (public access)
export default defineEventHandler(async (event) => {
  try {
    // Get share token from route params
    const shareToken = getRouterParam(event, 'token')

    if (!shareToken) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request - Share token is required',
      })
    }

    const { boardDb } = await import(
      '@modules/0001-boards/lib/boards.server.js'
    )

    // Get board by share token
    const board = await boardDb.getBoardByShareToken(shareToken)

    if (!board) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found - Shared board not found or access denied',
      })
    }

    return {
      success: true,
      message: 'Shared board retrieved successfully',
      data: board,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error retrieving shared board:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve shared board',
      data: { error: error.message },
    })
  }
})
