// GET /api/boards - Get all boards for the authenticated user
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

    const { boardDb } = await import(
      '@modules/0001-boards/lib/boards.server.js'
    )

    // Get query parameters
    const query = getQuery(event)
    const search = query.search

    let boards
    if (search) {
      boards = await boardDb.searchBoards(session.user.id, search)
    } else {
      boards = await boardDb.getUserBoards(session.user.id)
    }

    return {
      success: true,
      message: 'Boards retrieved successfully',
      data: boards,
      count: boards.length,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error retrieving boards:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve boards',
      data: { error: error.message },
    })
  }
})
