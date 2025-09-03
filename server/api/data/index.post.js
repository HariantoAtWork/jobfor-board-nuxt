// POST /api/data - Create or overwrite JSON data
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const dataPath = '.data/json/data.json'

    // Validate request body
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body. Must be a valid JSON object.',
      })
    }

    // Ensure directory exists
    const fs = await import('fs/promises')
    const path = await import('path')

    const dirPath = path.dirname(dataPath)
    await fs.mkdir(dirPath, { recursive: true })

    // Write data to file
    const jsonString = JSON.stringify(body, null, 2)
    await fs.writeFile(dataPath, jsonString, 'utf-8')

    return {
      success: true,
      message: 'Data created successfully',
      data: body,
      timestamp: new Date().toISOString(),
      filePath: dataPath,
    }
  } catch (error) {
    console.error('Error creating data:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create data',
      data: {
        error: error.message,
      },
    })
  }
})
