// PUT /api/data - Update existing JSON data
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

    // Check if file exists
    const fs = await import('fs/promises')
    const path = await import('path')

    let existingData = {}
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      existingData = JSON.parse(data)
    } catch (readError) {
      // File doesn't exist, create it
      const dirPath = path.dirname(dataPath)
      await fs.mkdir(dirPath, { recursive: true })
    }

    // Merge existing data with new data (deep merge)
    const mergedData = { ...existingData, ...body }

    // Write merged data to file
    const jsonString = JSON.stringify(mergedData, null, 2)
    await fs.writeFile(dataPath, jsonString, 'utf-8')

    return {
      success: true,
      message: 'Data updated successfully',
      data: mergedData,
      timestamp: new Date().toISOString(),
      filePath: dataPath,
      merged: true,
    }
  } catch (error) {
    console.error('Error updating data:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update data',
      data: {
        error: error.message,
      },
    })
  }
})
