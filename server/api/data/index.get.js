// GET /api/data - Retrieve JSON data
export default defineEventHandler(async (event) => {
  try {
    const dataPath = '.data/json/data.json'

    // Check if file exists
    const fileExists = await $fetch('/api/data/exists', { method: 'GET' })

    if (!fileExists.exists) {
      return {
        success: false,
        message: 'Data file does not exist',
        data: null,
      }
    }

    // Read the JSON file
    const fs = await import('fs/promises')
    const data = await fs.readFile(dataPath, 'utf-8')
    const jsonData = JSON.parse(data)

    return {
      success: true,
      message: 'Data retrieved successfully',
      data: jsonData,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Error reading data:', error)

    return {
      success: false,
      message: 'Failed to read data',
      error: error.message,
      timestamp: new Date().toISOString(),
    }
  }
})
