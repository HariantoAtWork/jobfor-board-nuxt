// POST /api/boards - Create a new board
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

    // Parse request body
    const body = await readBody(event)

    if (!body.title || !body.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request - title and data are required',
      })
    }

    // Validate board data structure
    if (
      !body.data.id ||
      !Array.isArray(body.data.columns) ||
      !Array.isArray(body.data.cards)
    ) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request - invalid board data structure',
      })
    }

    const { boardDb } = await import('@modules/0000-auth/lib/boards.server.js')

    // Create the board
    const board = await boardDb.createBoard(
      session.user.id,
      body.title,
      body.data
    )

    return {
      success: true,
      message: 'Board created successfully',
      data: board,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error creating board:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create board',
      data: { error: error.message },
    })
  }
})
